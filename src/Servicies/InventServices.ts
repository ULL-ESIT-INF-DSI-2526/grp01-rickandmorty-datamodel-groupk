import { Invents } from "../Class/Invents";
import { Character } from "../Class/Character";
import { Services } from "../Interface/IServices";

export class LocationServices implements Services<Invents>{
    private _invent: Invents[];
    
    constructor(invent: Invents[]) {
        this._invent = invent;
    }
    
    getAll(): Invents[] {
        return this._invent;
    }
    
    add(invent: Invents): void {
        this._invent.push(invent);
    }
    
    remove(id: string): void {
        this._invent = this._invent.filter(d => d.id !== id);
    }
    
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
    
    consultLocationByName(name: string): Invents[] {
        return this._invent.filter(i => i.name === name);
    }
   
    consultLocationByType(type: string): Invents[] {
        return this._invent.filter(i => i.type === type);
    }
    
    consultLocationByInventor(inventor: Character): Invents[] {
        return this._invent.filter(i => i.inventor === inventor);
    }

    consultLocationByDangerLevel(dangerLevel: number): Invents[] {
        return this._invent.filter(i => i.dangerLevel === dangerLevel);
    }

}