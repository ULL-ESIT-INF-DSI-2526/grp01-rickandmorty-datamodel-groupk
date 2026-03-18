import { Dimensions } from "../Class/Dimensions";
import { Planets } from "../Class/Planets";
import { Services } from "../Interface/IServices";

export class LocationServices implements Services<Planets>{
    private _location: Planets[];

    constructor(location: Planets[]) {
        this._location = location;
    }

    getAll(): Planets[] {
        return this._location;
    }

    add(location: Planets): void {
        this._location.push(location);
    }

    remove(id: string): void {
        this._location = this._location.filter(d => d.id !== id);
    }

    modify(id: string, mod: Partial<Planets>): boolean {
        const location = this._location.find(d => d.id === id);

        if(!location) { return false; }
        if(mod.name !== undefined) { location.name = mod.name; }
        if(mod.type !== undefined) { location.type = mod.type; }
        if(mod.dimension !== undefined) { location.dimension = mod.dimension; }
        if(mod.population !== undefined) { location.population = mod.population; }
        if(mod.desc !== undefined) { location.desc = mod.desc; }
        
        return true;
    }

    consultLocationByName(name: string): Planets[] {
        return this._location.filter(l => l.name === name);
    }
    
    consultLocationByType(type: string): Planets[] {
        return this._location.filter(l => l.type === type);
    }
    consultLocationByDimension(dimension: Dimensions): Planets[] {
        return this._location.filter(l => l.dimension === dimension);
    }

}