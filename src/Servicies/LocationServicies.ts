import { Low } from "lowdb";
import { Data } from "../DataBase/db.js";

import { Dimensions } from "../Class/Dimensions.js";
import { Planets } from "../Class/Planets.js";
import { Services } from "../Interface/IServices.js";
/**
 * Clase LocationServices que implementa la interfaz Services con Planets
 */
export class LocationServices implements Services<Planets>{
    private _db: Low<Data>;

    /**
     * Constructor que recibe la referencia a la base de datos
     * @param database - instancia de Low<Data>
     */
    constructor(database: Low<Data>) {
        this._db = database;
    }
    /**
     * Getter para la localización (array de planetas)
     * @returns - localización
     */
    async getAll(): Promise<Planets[]> {
        await this._db.read();
        return this._db.data.planets;
    }
    /**
     * Método que añade una nueva localización
     * @param location - localización a añadir
     */
    async add(location: Planets): Promise<void> {
        await this._db.read();

        if(this._db.data.planets.find(l => l.id === location.id)) {
            throw new Error("No se puede añadir esa localización porque ya existe")
        }

        // Guardamos un objeto plano para evitar serializar atributos privados (_id, _name, ...)
        this._db.data.planets.push({
            id: location.id,
            name: location.name,
            type: location.type,
            dimension: location.dimension,
            population: location.population,
            desc: location.desc,
        } as Planets);
        
        await this._db.write();
    }
    /**
     * Método que elimina una localización por identificador
     * @param id - identificador de la localización a eliminar
     */
    async remove(id: string): Promise<void> {
        await this._db.read();

        if(this._db.data.planets.findIndex(l => l.id === id) === -1) {
            throw new Error("No se puede eliminar una localización que no existe")
        }

        this._db.data.planets = this._db.data.planets.filter(l => l.id !== id);
        await this._db.write();
    }
    /**
     * Método para modificar una localización por identificador
     * @param id - identificador
     * @param mod - objeto con las propiedades a modificar
     * @returns - true o false, dependiendo de si se modificó o no la localización
     */
    async modify(id: string, mod: Partial<Planets>): Promise<boolean> {
        await this._db.read();
        const location = this._db.data.planets.find(l => l.id === id);

        if(!location) { return false; }
        if(mod.name !== undefined) { location.name = mod.name; }
        if(mod.type !== undefined) { location.type = mod.type; }
        if(mod.dimension !== undefined) { location.dimension = mod.dimension; }
        if(mod.population !== undefined) { location.population = mod.population; }
        if(mod.desc !== undefined) { location.desc = mod.desc; }
        
        await this._db.write();
        return true;
    }
    /**
     * Método para consultar una localización por su nombre
     * @param name - nombre de la localización a consultar
     * @returns - array de localizaciones que coinciden con el nombre
     */
    async consultLocationByName(name: string): Promise<Planets[]> {
        await this._db.read();
        return this._db.data.planets.filter(l => l.name === name);
    }
    /**
     * Método para consultar una localización por su tipo
     * @param type - tipo de la localización a consultar
     * @returns - array de localizaciones que coinciden con el tipo
     */
    async consultLocationByType(type: string): Promise<Planets[]> {
        await this._db.read();
        return this._db.data.planets.filter(l => l.type === type);
    }
    /**
     * Método para consultar una localización por su dimensión
     * @param dimension - dimensión de la localización a consultar
     * @returns - array de localizaciones que coinciden con la dimensión
     */
    async consultLocationByDimension(dimension: Dimensions): Promise<Planets[]> {
        await this._db.read();
        return this._db.data.planets.filter(l => l.dimension === dimension);
    }

}