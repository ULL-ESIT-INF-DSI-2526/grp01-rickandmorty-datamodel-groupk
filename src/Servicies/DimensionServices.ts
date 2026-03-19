import { Dimensions } from "../Class/Dimensions";
import { Services } from "../Interface/IServices";

export class LocationServices implements Services<Dimensions>{  //En esta clase hay que poner función para localizar versiones alternativas??
    private _dimension: Dimensions[];
    
    constructor(dimension: Dimensions[]) {
        this._dimension = dimension;
    }
    
    getAll(): Dimensions[] {
        return this._dimension;
    }
    
    add(dimension: Dimensions): void {
        this._dimension.push(dimension);
    }
    
    remove(id: string): void {
        this._dimension = this._dimension.filter(d => d.id !== id);
    }
    
    
    modify(id: string, mod: Partial<Dimensions>): boolean {
        const dimension = this._dimension.find(d => d.id === id);

        if(!dimension) { return false; }
        if(mod.name !== undefined) { dimension.name = mod.name; }
        if(mod.state !== undefined) { dimension.state = mod.state; }
        if(mod.techlevel !== undefined) { dimension.techlevel = mod.techlevel; }
        if(mod.desc !== undefined) { dimension.desc = mod.desc; }
        
        return true;
    }

}