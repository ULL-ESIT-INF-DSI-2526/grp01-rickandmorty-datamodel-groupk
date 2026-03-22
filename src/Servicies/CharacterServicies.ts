import { Low } from "lowdb";
import { Data } from "../DataBase/db.js";

import { Character } from "../Class/Character.js";
import { Dimensions } from "../Class/Dimensions.js";
import { Species } from "../Class/Species.js";
import { Services } from "../Interface/IServices.js";

/**
 * Clase para los servicios de los personajes que ahora usa Lowdb
 */
export class CharacterServices implements Services<Character> {
    private _db: Low<Data>;

    /**
     * Constructor que recibe la referencia a la base de datos
     * @param database - instancia de Low<Data>
     */
    constructor(database: Low<Data>) {
        this._db = database;
    }

    /** 
     * Devuelve todos los personajes de la base de datos
     * @returns array de personajes
     */
    async getAll(): Promise<Character[]> {
        await this._db.read();
        return this._db.data.characters;
    }

    /**
     * Añade un nuevo personaje
     * @param character - personaje a añadir
     */
    async add(character: Character): Promise<void> {
        await this._db.read();

        if (this._db.data.characters.find(c => c.id === character.id)) {
            throw new Error("No se puede añadir ese personaje porque ya existe");
        }

        // Guardamos un objeto plano para evitar serializar atributos privados (_id, _name, ...)
        this._db.data.characters.push({
            id: character.id,
            name: character.name,
            species: character.species,
            dimension: character.dimension,
            state: character.state,
            afiliation: character.afiliation,
            iq: character.iq,
            desc: character.desc
        } as Character);

        await this._db.write();
    }

    /**
     * Elimina un personaje por id
     * @param id - id del personaje a eliminar
     */
    async remove(id: string): Promise<void> {
        await this._db.read();

        if (this._db.data.characters.findIndex(c => c.id === id) === -1) {
            throw new Error("No se puede eliminar un personaje que no existe");
        }

        this._db.data.characters = this._db.data.characters.filter(c => c.id !== id);
        await this._db.write();
    }

    /**
     * Modifica un personaje por id
     * @param id - identificador del personaje
     * @param mod - objeto Partial con las propiedades a modificar
     * @returns - true si se modificó, false si no se encontró
     */
    async modify(id: string, mod: Partial<Character>): Promise<boolean> {
        await this._db.read();
        const character = this._db.data.characters.find(c => c.id === id);
        
        if (!character) {
            return false;
        }

        if (mod.name !== undefined) { character.name = mod.name; }
        if (mod.species !== undefined) { character.species = mod.species; }
        if (mod.dimension !== undefined) { character.dimension = mod.dimension; }
        if (mod.state !== undefined) { character.state = mod.state; }
        if (mod.afiliation !== undefined) { character.afiliation = mod.afiliation; }
        if (mod.iq !== undefined) { character.iq = mod.iq; }
        if (mod.desc !== undefined) { character.desc = mod.desc; }

        await this._db.write();
        return true;
    }

    /**
     * Método para consultar personaje por su nombre
     * @param name - nombre del personaje
     * @param direction - dirección en la que ordenamos (false = asc, true = desc)
     * @param sort - criterio de ordenación (1 = nombre, 2 = IQ)
     * @returns array de personajes que coinciden con el nombre 
     */
    async consultCharacterByName(name: string, direction: boolean = false, sort?: number): Promise<Character[]> {
        await this._db.read();
        const characters = this._db.data.characters.filter(c => c.name === name);
        return this.applySorting(characters, direction, sort);
    }

    /**
     * Método para consultar personaje por su especie
     * @param specie - especie del personaje
     * @param direction - dirección en la que ordenamos (false = asc, true = desc)
     * @param sort - criterio de ordenación (1 = nombre, 2 = IQ)
     * @returns array de personajes que coinciden con la especie
     */
    async consultCharacterBySpecies(specie: Species, direction: boolean = false, sort?: number): Promise<Character[]> {
        await this._db.read();
        // Comparamos por ID para evitar problemas de referencias de objetos en memoria vs BBDD
        const characters = this._db.data.characters.filter(c => c.species.id === specie.id);
        return this.applySorting(characters, direction, sort);
    }

    /**
     * Método para consultar personaje por su afiliación
     * @param afiliation - afiliación del personaje
     * @param direction - dirección en la que ordenamos (false = asc, true = desc)
     * @param sort - criterio de ordenación (1 = nombre, 2 = IQ)
     */
    async consultCharacterByAfilation(afiliation: string, direction: boolean = false, sort?: number): Promise<Character[]> {
        await this._db.read();
        const characters = this._db.data.characters.filter(c => c.afiliation === afiliation);
        return this.applySorting(characters, direction, sort);
    }

    /**
     * Método para consultar un personaje por su estado
     * @param state - estado del personaje 
     * @param direction - dirección en la que ordenamos (false = asc, true = desc)
     * @param sort - criterio de ordenación (1 = nombre, 2 = IQ)
     * @returns array de personajes que coinciden con el estado
     */
    async consultCharacterByState(state: string, direction: boolean = false, sort?: number): Promise<Character[]> {
        await this._db.read();
        const characters = this._db.data.characters.filter(c => c.state === state);
        return this.applySorting(characters, direction, sort);
    }

    /**
     * Método para consultar un personaje por su dimensión
     * @param dimension - dimensión del personaje a consultar
     * @returns - array de personajes que coinciden con la dimensión
     */
    async consultCharacterByDimension(dimension: Dimensions): Promise<Character[]> {
        await this._db.read();
        return this._db.data.characters.filter(c => c.dimension === dimension);
    }

    /**
     * Localiza todas las versiones alternativas de un personaje por nombre.
     * @param name - nombre del personaje a buscar
     * @returns array de personajes que coinciden con el nombre, incluyendo versiones alternativas
     */
    async findAllVersions(name: string): Promise<Character[]> {
        await this._db.read();
        return this._db.data.characters.filter(c => c.name === name);
    }

    /**
     * Método centralizado para aplicar la ordenación
     * @param characters - array de personajes a ordenar
     * @param direction - dirección de ordenación (false = asc, true = desc)
     * @param sort - criterio de ordenación (1 = nombre, 2 = IQ)
     * @returns array de personajes ordenados 
     */
    async applySorting(characters: Character[], direction: boolean, sort?: number): Promise<Character[]> {
        if (sort === 1) {
            return this.sortByName(characters, direction);
        }

        if (sort === 2) {
            return this.sortByIq(characters, direction);
        }

        return characters;
    }

    /**
     * Ordena personajes por nombre
     * @param characters - array de personajes a ordenar
     * @param direction - dirección de ordenación (false = asc, true = desc)
     * @returns array de personajes ordenados por nombre
     */
    async sortByName(characters: Character[], direction: boolean): Promise<Character[]>{
        // Usamos el método moderno y limpio de JS para ordenar (más seguro que el for manual)
        const sorted = [...characters].sort((a, b) => a.name.localeCompare(b.name));
        return direction ? sorted.reverse() : sorted;
    }

    /**
     * Ordena personajes por su nivel de inteligencia
     * @param characters - array de personajes a ordenar
     * @param direction - dirección de ordenación (false = asc, true = desc)
     * @returns array de personajes ordenados por IQ
     */
    async sortByIq(characters: Character[], direction: boolean = false): Promise<Character[]> {
        // Usamos tu método comentado que es mucho más limpio y cumple SOLID
        return [...characters].sort((a, b) => direction ? b.iq - a.iq : a.iq - b.iq);
    }
}