import { Low } from "lowdb";
import { Data } from "../DataBase/db.js";

import { Invents } from "../Class/Invents.js";
import { Character } from "../Class/Character.js";
import { Services } from "../Interface/IServices.js";

export class InventServices implements Services<Invents>{
    private _db: Low<Data>;

    /**
     * Constructor que recibe la referencia a la base de datos
     * @param database - instancia de Low<Data>
     */
    constructor(database: Low<Data>) {
        this._db = database;
    }
    /**
     * Devuelve todos los inventos
     */
    async getAll(): Promise<Invents[]> {
        await this._db.read();
        return this._db.data.invents;
    }
    /**
     * Método para añadir un invento a la lista de inventos
     * @param invent - invento a añadir
     */
    async add(invent: Invents): Promise<void> {
        await this._db.read();

        if(this._db.data.invents.find(i => i.id === invent.id)) {
            throw new Error("No se puede añadir ese invento porque ya existe")
        }

        // Guardamos un objeto plano para evitar serializar atributos privados (_id, _name, ...)
        this._db.data.invents.push({
            id: invent.id,
            name: invent.name,
            inventor: invent.inventor,
            type: invent.type,
            dangerLevel: invent.dangerLevel,
            desc: invent.desc,
        } as Invents);
        
        await this._db.write();
    }
    /**
     * Método para eliminar un invento de la lista de inventos
     * @param id - id del invento a eliminar
     */
    async remove(id: string): Promise<void> {
        await this._db.read();

        if(this._db.data.invents.findIndex(i => i.id === id) === -1) {
            throw new Error("No se puede eliminar un invento que no existe")
        }

        this._db.data.invents = this._db.data.invents.filter(i => i.id !== id);
        await this._db.write();
    }
    /**
     * Método para modificar un invento de la lista de inventos
     * @param id - id del invento a modificar
     * @param mod - objeto con las propiedades a modificar del invento
     * @returns - true si se ha modificado el invento, false si no se ha encontrado el invento
     */
    async modify(id: string, mod: Partial<Invents>): Promise<boolean> {
        await this._db.read();
        const invent = this._db.data.invents.find(i => i.id === id);

        if(!invent) { return false; }
        if(mod.name !== undefined) { invent.name = mod.name; }
        if(mod.type !== undefined) { invent.type = mod.type; }
        if(mod.inventor !== undefined) { invent.inventor = mod.inventor; }
        if(mod.dangerLevel !== undefined) { invent.dangerLevel = mod.dangerLevel; }
        if(mod.desc !== undefined) { invent.desc = mod.desc; }
    
        await this._db.write();
        return true;
    }
    /**
     * Método para consultar un invento por su nombre
     * @param name - nombre del invento a consultar
     * @returns - array de inventos que coinciden con el nombre dado
     */
    async consultInventByName(name: string): Promise<Invents[]> {
        await this._db.read();
        return this._db.data.invents.filter(i => i.name === name);
    }
    /**
     * Método para consultar un invento por su tipo
     * @param type - tipo del invento a consultar
     * @returns - array de inventos que coinciden con el tipo dado
     */
    async consultInventByType(type: string): Promise<Invents[]> {
        await this._db.read();
        return this._db.data.invents.filter(i => i.type === type);
    }
    /**
     * Método para consultar un invento por su inventor
     * @param inventor - inventor del invento a consultar
     * @returns - array de inventos que coinciden con el inventor dado
     */
    async consultInventByInventor(inventor: Character): Promise<Invents[]> {
        await this._db.read();
        return this._db.data.invents.filter(i => i.inventor === inventor);
    }
    /**
     * Método para consultar un invento por su nivel de peligro
     * @param dangerLevel - nivel de peligro del invento a consultar
     * @returns - array de inventos que coinciden con el nivel de peligro dado
     */
    async consultInventByDangerLevel(dangerLevel: number): Promise<Invents[]> {
        await this._db.read();
        return this._db.data.invents.filter(i => i.dangerLevel === dangerLevel);
    }

}