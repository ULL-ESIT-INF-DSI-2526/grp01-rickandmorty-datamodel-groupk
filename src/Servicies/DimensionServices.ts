import { Dimensions } from "../Class/Dimensions";
import { Services } from "../Interface/IServices";

export class LocationServices implements Services<Dimensions>{  //En esta clase hay que poner función para localizar versiones alternativas??
    private _dimension: Dimensions[];
    /**
     * Constructor
     * @param dimension - dimension 
     */
    constructor(dimension: Dimensions[]) {
        this._dimension = dimension;
    }
    /**
     * Getter para las dimensiones
     * @returns array de dimensiones
     */
    getAll(): Dimensions[] {
        return this._dimension;
    }
    /**
     * Método para añadir una nueva dimensión
     * @param dimension - dimensión a añadir
     */
    add(dimension: Dimensions): void {
        this._dimension.push(dimension);
    }
    /**
     * Método para eliminar una dimensión por id
     * @param id - id de la dimensión a eliminar
     */
    remove(id: string): void {
        this._dimension = this._dimension.filter(d => d.id !== id);
    }
    /**
     * Método para modificar una dimensión por id
     * @param id - id de la dimensión a modificar   
     * @param mod - objeto con las propiedades a modificar (name, state, techlevel, desc)
     * @returns - true si se ha modificado correctamente, false si no se ha encontrado la dimensión
     */
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