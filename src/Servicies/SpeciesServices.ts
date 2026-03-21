import { Low } from "lowdb";
import { Data } from "../DataBase/db.js";

import { Species } from "../Class/Species.js";
import { Services } from "../Interface/IServices.js";

/**
 * Clase LocationServices que ahora usa Lowdb para guardar especies
 */
export class SpeciesServices implements Services<Species> {
    private _db: Low<Data>;

    /**
     * Constructor que recibe la referencia a la base de datos
     * @param database - instancia de Low<Data>
     */
    constructor(database: Low<Data>) {
        this._db = database;
    }

    /**
     * Devuelve todas las especies
     */
    async getAll(): Promise<Species[]> {
        await this._db.read();
        return this._db.data.species;
    }

    /**
     * Añade una nueva despecie
     * @param specie - Especie a añadir
     */
    async add(specie: Species): Promise<void> {
        await this._db.read();

        if(this._db.data.species.find(e => e.id === specie.id)) {
            throw new Error("No se puede añadir esa especie porque ya existe")
        }

        // Guardamos un objeto plano para evitar serializar atributos privados (_id, _name, ...)
        this._db.data.species.push({
            id: specie.id,
            name: specie.name,
            origin: specie.origin,
            type: specie.type,
            expectancy: specie.expectancy,
            desc: specie.desc,
        } as Species);

        await this._db.write();
    }

    /**
     * Elimina una especie por id
     * @param id - id de la especie a eliminar
     */
    async remove(id: string): Promise<void> {
        await this._db.read();

        if(this._db.data.species.findIndex(e => e.id === id) === -1) {
            throw new Error("No se puede eliminar una especie que no existe")
        }

        this._db.data.species = this._db.data.species.filter(e => e.id !== id);
        await this._db.write();
    }

    /**
     * Modifica una especie por id
     * @param id - id de la especie a modificar
     * @param mod - propiedades a modificar
     * @returns true si se ha modificado, false si no se encontró
     */
    async modify(id: string, mod: Partial<Species>): Promise<boolean> {
        await this._db.read();
        const specie = this._db.data.species.find(e => e.id === id);

        if (!specie) { return false; }
        if (mod.name !== undefined) { specie.name = mod.name; }
        if (mod.origin !== undefined) { specie.origin = mod.origin; } 
        if (mod.type !== undefined) { specie.type = mod.type; }
        if (mod.expectancy !== undefined) { specie.expectancy = mod.expectancy; }
        if (mod.desc !== undefined) { specie.desc = mod.desc; }

        await this._db.write();
        return true;
    }
}