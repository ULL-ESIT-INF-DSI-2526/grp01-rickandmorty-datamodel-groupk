import { Species } from "./Species.js";
import { Dimensions } from "./Dimensions.js";
import { Attributes } from "./AbstractAttributes.js";

/**
 * Clase para definir los personajes que extiende a la clase abstracta Attributes
 */
export class Character extends Attributes{
    private _species: Species;
    private _dimension: Dimensions;
    private _state: string;
    private _afiliation: string;
    private _iq: number;

    /**
     * Constructor del objeto Character
     * @param id - ID del personaje
     * @param name - Nombre del personaje
     * @param species - Especie del personaje, lo cual es del tipo Species
     * @param dimension - Dimensión a la que pertenece, lo cual es del tipo Dimensions
     * @param state - Estado del personaje
     * @param afiliation - Afiliación del personaje
     * @param iq - IQ del personaje entre 1 y 10
     * @param desc - Descripción del personaje
     */
    constructor( id:string, name: string, species: Species, dimension: Dimensions, state: string, afiliation: string, iq: number, desc: string) {
        super(id, name, desc);
        this._species = species;
        this._dimension = dimension;
        this._state = state;
        this._afiliation = afiliation;
        if (iq < 1 || iq > 10) {
            throw new Error("El nivel de inteligencia debe estar entre 1 y 10");
        }
        this._iq = iq;
    }

    /**
     * Getter para la especie
     */
    get species(): Species { return this._species; }

    /**
     * Getter para la dimensión
     */
    get dimension(): Dimensions { return this._dimension; }

    /**
     * Getter para el estado
     */
    get state(): string { return this._state; }

    /**
     * Getter para la afiliación
     */
    get afiliation(): string { return this._afiliation; }

    /**
     * Getter para el IQ
     */
    get iq(): number { return this._iq; }

    /**
     * Setter para la especie
     */
    set species(newSpec: Species) {
        this._species = newSpec;
    }

    /**
     * Setter para la dimensión
     */
    set dimension(newDim: Dimensions) {
        this._dimension = newDim;
    }

    /**
     * Setter para el estado
     */
    set state(newState: string) {
        this._state = newState;
    }

    /**
     * Setter para la afiliación
     */
    set afiliation(newAfil: string) {
        this._afiliation = newAfil;
    }

    /**
     * Setter para el IQ
     */
    set iq(newIQ: number) {
        if (newIQ < 1 || newIQ > 10) {
            throw new Error("El nivel de inteligencia debe estar entre 1 y 10");
        }
        this._iq = newIQ;
    }
}