import { Low } from "lowdb";
import { Data, EventType, MultiverseEvent } from "../DataBase/db.js";
import { DimensionState } from "../Enums/DimensionState.js";
import { Character } from "../Class/Character.js";
import { Dimensions } from "../Class/Dimensions.js";
import { Invents } from "../Class/Invents.js";

import { LocationServices } from "./LocationServicies.js"; 
import { DimensionServices } from "./DimensionServices.js";
import { InventServices } from "./InventServices.js";
import { CharacterServices } from "./CharacterServicies.js";
import { SpeciesServices } from "./SpeciesServices.js";

/**
 * Gestor central del Multiverso.
 * Contiene todos los servicios y la lógica avanzada de eventos e informes.
 */
export class MultiverseManager {
    private _db: Low<Data>;
    
    // Instancias públicas de los servicios para acceso directo desde el gestor
    public dimensions: DimensionServices;
    public characters: CharacterServices;
    public localitations: LocationServices;
    public invents: InventServices;
    public species: SpeciesServices;

    /**
     * El constructor toma la base de datos como parámetro y la usa para inicializar los servicios,
     * de esta forma el gestor tiene acceso a todo el multiverso
     * @param dataBase - Base de datos
     */
    constructor(dataBase: Low<Data>) {
        this._db = dataBase;
        this.dimensions = new DimensionServices(dataBase);
        this.characters = new CharacterServices(dataBase); 
        this.localitations = new LocationServices(dataBase);
        this.invents = new InventServices(dataBase);
        this.species = new SpeciesServices(dataBase);
    }

    /**
     * Detecta personajes cuya dimensión de origen ha sido destruida o borrada de los registros
     * @returns Array de personajes 
     */
    async checkOrphanCharacters(): Promise<Character[]> {
        await this._db.read();
        const orphans: Character[] = [];

        for (const char of this._db.data.characters) {
            // Leemos el ID de la dimensión de forma segura
            const rawChar = char as unknown as { dimension?: { id?: string }, _dimension?: { _id?: string } };
            const dimId = rawChar.dimension?.id ?? rawChar._dimension?._id;

            const homeDim = this._db.data.dimensions.find(d => {
                const rawD = d as unknown as { id?: string, _id?: string };
                return (rawD.id ?? rawD._id) === dimId;
            });
            
            const rawHomeDim = homeDim as { state?: string, _state?: string } | undefined;
            const state = rawHomeDim?.state ?? rawHomeDim?._state;

            if (!homeDim || state === DimensionState.DESTRUIDA || state === "Destruida") {
                orphans.push(char);
            }
        }
        return orphans;
    }

    /**
     * Registra el viaje de un personaje de una dimensión a otra
     * @param characterId - ID del personaje que viaja
     * @param fromDimId - ID de la dimensión de origen
     * @param toDimId - ID de la dimensión de destino
     * @param reason - Motivo del viaje 
     */
    async registerTravel(characterId: string, fromDimId: string, toDimId: string, reason: string): Promise<void> {
        await this._db.read();
        
        const newEvent: MultiverseEvent = {
            id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: EventType.TRAVEL,
            date: new Date().toISOString(),
            description: `Viaje interdimensional por motivo: ${reason}`,
            payload: { characterId, fromDimId, toDimId }
        };

        this._db.data.events.push(newEvent);
        await this._db.write();
    }

    /**
     * Registra la creación o destrucción de una dimensión 
     * @param dimensionId - ID de la dimensión afectada
     * @param isDestruction - true si es destrucción, false si es creación
     * @param reason - Motivo de la creación o destrucción
     */
    async registerDimensionAnomaly(dimensionId: string, isDestruction: boolean, reason: string): Promise<void> {
        await this._db.read();
        
        const action = isDestruction ? "Destrucción" : "Creación";
        const newEvent: MultiverseEvent = {
            id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: EventType.DIMENSION_CHANGE,
            date: new Date().toISOString(),
            description: `${action} de dimensión. Causa registrada: ${reason}`,
            payload: { dimensionId, isDestruction: isDestruction.toString() } 
        };

        this._db.data.events.push(newEvent);
        await this._db.write();
    }

    /**
     * Registra cuando un invento se despliega en una localización, o cuando es neutralizado
     * @param inventId - ID del invento afectado
     * @param locationId - ID de la localización donde se despliega o neutraliza
     * @param isDeployed - true si se despliega, false si se neutraliza
     */
    async registerArtifactDeployment(inventId: string, locationId: string, isDeployed: boolean): Promise<void> {
        await this._db.read();

        const status = isDeployed ? "Desplegado" : "Neutralizado";
        const newEvent: MultiverseEvent = {
            id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: EventType.ARTIFACT_DEPLOYMENT,
            date: new Date().toISOString(),
            description: `Artefacto ${status} en la localización especificada.`,
            payload: { inventId, locationId, isDeployed: isDeployed.toString() } 
        };

        this._db.data.events.push(newEvent);
        await this._db.write();
    }


    /**
     * Informe 1: Listado de dimensiones activas con su nivel tecnológico medio
     * @returns Objeto con las dimensiones activas y la media matemática de su tecnología
     */
    async getActiveDimensionsReport(): Promise<{ activeDimensions: Dimensions[], averageTechLevel: number }> {
        await this._db.read();

        const active = this._db.data.dimensions.filter(
            d => d.state === DimensionState.ACTIVA || "Activa"
        );

        if (active.length === 0) {
            return { activeDimensions: [], averageTechLevel: 0 };
        }

        const totalTech = active.reduce(
            (sum, dim) => sum + dim.techlevel,
            0
        );

        const avgTech = totalTech / active.length;

        return {
            activeDimensions: active,
            averageTechLevel: avgTech
        };
    }

    /**
     * Informe 2: Personajes con mayor número de versiones alternativas registradas
     * Agrupa por nombre exacto y cuenta cuántos existen
     * @returns Array de objetos con el nombre del personaje y la cantidad de versiones
     */
    async getCharactersWithMostVersions(): Promise<{ name: string, count: number }[]> {
        await this._db.read();

        const versionCounts: Record<string, number> = {};
        this._db.data.characters.forEach(char => {
            const rawChar = char as unknown as { name?: string, _name?: string };
            const name = rawChar.name ?? rawChar._name;
            if (name) {
                versionCounts[name] = (versionCounts[name] || 0) + 1;
            }
        });
        return Object.entries(versionCounts)
            .map(([name, count]) => ({ name, count }))
            .filter(item => item.count > 1)
            .sort((a, b) => b.count - a.count);
    }

    /**
     * Informe 3: Inventos más peligrosos desplegados actualmente y su localización.
     * Lee el historial temporal para saber si un artefacto sigue desplegado o si ya fue neutralizado.
     * @returns Array de objetos con el invento y la localización donde está desplegado
     */
    async getMostDangerousDeployedArtifacts(): Promise<{ invent: Invents, locationId: string }[]> {
        await this._db.read();

        const deploymentStatus = new Map<string, string>(); 
        const sortedEvents = this._db.data.events
            .filter(e => e.type === EventType.ARTIFACT_DEPLOYMENT)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
        sortedEvents.forEach(e => {
            const isDeployed = e.payload.isDeployed === "true";
            if (isDeployed) {
                deploymentStatus.set(e.payload.inventId, e.payload.locationId);
            } else {
                deploymentStatus.delete(e.payload.inventId); 
            }
        });
        
        const dangerousArtifacts: { invent: Invents, locationId: string }[] = [];
        for (const [inventId, locationId] of deploymentStatus.entries()) {
            const invent = this._db.data.invents.find(i => {
                const rawI = i as unknown as { id?: string, _id?: string };
                return (rawI.id ?? rawI._id) === inventId;
            });

            if (invent) {
                dangerousArtifacts.push({ invent, locationId });
            }
        }
        
        return dangerousArtifacts.sort((a, b) => {
            const rawA = a.invent as { dangerLevel?: number, _dangerLevel?: number, _level?: number };
            const rawB = b.invent as { dangerLevel?: number, _dangerLevel?: number, _level?: number };
            const levelA = Number(rawA.dangerLevel ?? rawA._dangerLevel ?? rawA._level ?? 0);
            const levelB = Number(rawB.dangerLevel ?? rawB._dangerLevel ?? rawB._level ?? 0);
            return levelB - levelA;
        });
    }

    /**
     * Informe 4: Historial de viajes interdimensionales de un personaje específico
     * Filtra los eventos de tipo TRAVEL por el ID del personaje y ordena por fecha descendente
     * @param characterId - ID del personaje a consultar
     * @returns Array de eventos de viaje relacionados con el personaje 
     */
    async getCharacterTravelHistory(characterId: string): Promise<MultiverseEvent[]> {
        await this._db.read();
        return this._db.data.events
            .filter(e => e.type === EventType.TRAVEL && e.payload.characterId === characterId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 
    }
}