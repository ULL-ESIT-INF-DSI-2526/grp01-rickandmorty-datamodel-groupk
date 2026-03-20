import { Dimensions } from "../Class/Dimensions.js";
import { Planets } from "../Class/Planets.js";
import { Services } from "../Interface/IServices.js";
/**
 * Clase LocationServices que implementa la interfaz Services con Planets
 */
export class LocationServices implements Services<Planets>{
    private _location: Planets[];
    /**
     * Constructor de la clase
     * @param location - localización 
     */
    constructor(location: Planets[]) {
        this._location = location;
    }
    /**
     * Getter para la localización (array de planetas)
     * @returns - localización
     */
    getAll(): Planets[] {
        return this._location;
    }
    /**
     * Método que añade una nueva localización
     * @param location - localización a añadir
     */
    add(location: Planets): void {
        this._location.push(location);
    }
    /**
     * Método que elimina una localización por identificador
     * @param id - identificador de la localización a eliminar
     */
    remove(id: string): void {
        this._location = this._location.filter(d => d.id !== id);
    }
    /**
     * Método para modificar una localización por identificador
     * @param id - identificador
     * @param mod - objeto con las propiedades a modificar
     * @returns - true o false, dependiendo de si se modificó o no la localización
     */
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
    /**
     * Método para consultar una localización por su nombre
     * @param name - nombre de la localización a consultar
     * @returns - array de localizaciones que coinciden con el nombre
     */
    consultLocationByName(name: string): Planets[] {
        return this._location.filter(l => l.name === name);
    }
    /**
     * Método para consultar una localización por su tipo
     * @param type - tipo de la localización a consultar
     * @returns - array de localizaciones que coinciden con el tipo
     */
    consultLocationByType(type: string): Planets[] {
        return this._location.filter(l => l.type === type);
    }
    /**
     * Método para consultar una localización por su dimensión
     * @param dimension - dimensión de la localización a consultar
     * @returns - array de localizaciones que coinciden con la dimensión
     */
    consultLocationByDimension(dimension: Dimensions): Planets[] {
        return this._location.filter(l => l.dimension === dimension);
    }

}