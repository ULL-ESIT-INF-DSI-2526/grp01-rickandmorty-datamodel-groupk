import { Invents } from "../Class/Invents";
import { Character } from "../Class/Character";
import { Services } from "../Interface/IServices";

export class LocationServices implements Services<Invents>{
    private _invent: Invents[];
    /**
     * Constructor
     * @param invent - array de inventos 
     */
    constructor(invent: Invents[]) {
        this._invent = invent;
    }
    /**
     * Devuelve todos los inventos
     */
    getAll(): Invents[] {
        return this._invent;
    }
    /**
     * Método para añadir un invento a la lista de inventos
     * @param invent - invento a añadir
     */
    add(invent: Invents): void {
        this._invent.push(invent);
    }
    /**
     * Método para eliminar un invento de la lista de inventos
     * @param id - id del invento a eliminar
     */
    remove(id: string): void {
        this._invent = this._invent.filter(d => d.id !== id);
    }
    /**
     * Método para modificar un invento de la lista de inventos
     * @param id - id del invento a modificar
     * @param mod - objeto con las propiedades a modificar del invento
     * @returns - true si se ha modificado el invento, false si no se ha encontrado el invento
     */
    modify(id: string, mod: Partial<Invents>): boolean {
        const invent = this._invent.find(d => d.id === id);

        if(!invent) { return false; }
        if(mod.name !== undefined) { invent.name = mod.name; }
        if(mod.type !== undefined) { invent.type = mod.type; }
        if(mod.inventor !== undefined) { invent.inventor = mod.inventor; }
        if(mod.dangerLevel !== undefined) { invent.dangerLevel = mod.dangerLevel; }
        if(mod.desc !== undefined) { invent.desc = mod.desc; }
        
        return true;
    }
    /**
     * Método para consultar un invento por su nombre
     * @param name - nombre del invento a consultar
     * @returns - array de inventos que coinciden con el nombre dado
     */
    consultInventByName(name: string): Invents[] {
        return this._invent.filter(i => i.name === name);
    }
    /**
     * Método para consultar un invento por su tipo
     * @param type - tipo del invento a consultar
     * @returns - array de inventos que coinciden con el tipo dado
     */
    consultInventByType(type: string): Invents[] {
        return this._invent.filter(i => i.type === type);
    }
    /**
     * Método para consultar un invento por su inventor
     * @param inventor - inventor del invento a consultar
     * @returns - array de inventos que coinciden con el inventor dado
     */
    consultInventByInventor(inventor: Character): Invents[] {
        return this._invent.filter(i => i.inventor === inventor);
    }
    /**
     * Método para consultar un invento por su nivel de peligro
     * @param dangerLevel - nivel de peligro del invento a consultar
     * @returns - array de inventos que coinciden con el nivel de peligro dado
     */
    consultInventByDangerLevel(dangerLevel: number): Invents[] {
        return this._invent.filter(i => i.dangerLevel === dangerLevel);
    }

}