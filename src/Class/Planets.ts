import { Dimensions } from "./Dimensions.js";
import { Attributes } from "./AbstractAttributes.js";

/**
 * Clase para definir los planetas, extiende de la clase Atttributes
 */
export class Planets extends Attributes{
    private _type: string;
    private _dimension: Dimensions;
    private _population: number;
    /**
     * Constructor para Planets
     * @param id - identificador único del planeta
     * @param name - nombre del planeta
     * @param type - tipo del planeta
     * @param dimension - dimensión a la que pertenece
     * @param population - habitantes aproximados del planeta
     * @param desc - breve descripción del planeta
     */
    constructor( id: string, name: string, type: string, dimension: Dimensions, population: number, desc: string) {
        super(id, name, desc)
        this._type = type;
        this._dimension = dimension;
        this._population = population;
    }
    /**
     * Getter para el tipo del planeta
     */
    get type(): string { return this._type; }
    /**
     * Getter para la dimensión del planeta
     */
    get dimension(): Dimensions { return this._dimension; }
    /**
     * Getter para los habitantes del planeta
     */
    get population(): number { return this._population; }
    /**
     * Setter para el tipo de planeta
     */
    set type(newType: string) {
        this._type = newType;
    }
    /**
     * Setter para la dimensión del planeta
     */
    set dimension(newDim: Dimensions) {
        this._dimension = newDim;
    }
    /**
     * Setter para los habitantes del planeta
     */
    set population(newPop: number) {
        this._population = newPop;
    }
}
