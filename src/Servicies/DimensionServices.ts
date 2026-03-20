import { Low } from "lowdb";
import { Data } from "../DataBase/db.js";

import { Dimensions } from "../Class/Dimensions.js";
import { Services } from "../Interface/IServices.js";

/**
 * Clase LocationServices que ahora usa Lowdb para guardar dimensiones
 */
export class DimensionServices implements Services<Dimensions> {
    private _db: Low<Data>;

    /**
     * Constructor que recibe la referencia a la base de datos
     * @param database - instancia de Low<Data>
     */
    constructor(database: Low<Data>) {
        this._db = database;
    }

    /**
     * Devuelve todas las dimensiones
     */
    async getAll(): Promise<Dimensions[]> {
        await this._db.read();
        return this._db.data.dimensions;
    }

    /**
     * Añade una nueva dimensión
     * @param dimension - dimensión a añadir
     */
    async add(dimension: Dimensions): Promise<void> {
        await this._db.read();

        if(this._db.data.dimensions.find(d => d.id === dimension.id)) {
            throw new Error("No se puede añadir esa dimensión porque ya existe")
        }

        this._db.data.dimensions.push(dimension);
        await this._db.write();
    }

    /**
     * Elimina una dimensión por id
     * @param id - id de la dimensión a eliminar
     */
    async remove(id: string): Promise<void> {
        await this._db.read();

        if(this._db.data.dimensions.findIndex(d => d.id === id) === -1) {
            throw new Error("No se puede eliminar una dimensión que no existe")
        }

        this._db.data.dimensions = this._db.data.dimensions.filter(d => d.id !== id);
        await this._db.write();
    }

    /**
     * Modifica una dimensión por id
     * @param id - id de la dimensión a modificar
     * @param mod - propiedades a modificar
     * @returns true si se ha modificado, false si no se encontró
     */
    async modify(id: string, mod: Partial<Dimensions>): Promise<boolean> {
        await this._db.read();
        const dimension = this._db.data.dimensions.find(d => d.id === id);

        if (!dimension) { return false; }
        if (mod.name !== undefined) { dimension.name = mod.name; }
        if (mod.state !== undefined) { dimension.state = mod.state; } 
        if (mod.techlevel !== undefined) { dimension.techlevel = mod.techlevel; }
        if (mod.desc !== undefined) { dimension.desc = mod.desc; }

        await this._db.write();
        return true;
    }

    /**
     * Buscar versiones alternativas de un personaje en esta dimensión
     * (Solo si quieres implementar la lógica aquí)
     */
    async findAlternativeVersions(name: string): Promise<Dimensions[]> {
        await this._db.read();
        return this._db.data.dimensions.filter(d => d.name === name);
    }
}