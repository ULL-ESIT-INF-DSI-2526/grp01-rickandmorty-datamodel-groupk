import { Dimensions } from "./Dimensions.js";
import { Planets } from "./Planets.js";
import { Attributes } from "./AbstractAttributes.js";
/**
 * Clase para definir especies, extiende de la clase Attributes
 */
export class Species extends Attributes {
    private _origin: Dimensions | Planets;
    private _type: string;
    private _expectancy: number;
    /**
     * Constructor de la clase Species
     * @param id - identificador único de la especie
     * @param name - nombre de la especie
     * @param origin - origen de la especie
     * @param type - tipo de la especie
     * @param expectancy - esperanza de vida media
     * @param desc - breve descripción de la especie
     */
    constructor( id:string, name: string, origin: Dimensions | Planets, type: string, expectancy: number, desc: string) {
        super(id, name, desc);
        this._origin = origin;
        this._type = type;
        this._expectancy = expectancy;
        
    }
    /**
     * Getter para el origen (dimensión o planeta)
     */
    get origin(): Dimensions | Planets { return this._origin; }
    /**
     * Getter para el tipo
     */
    get type(): string { return this._type; }
    /**
     * Getter para la esperanza de vida
     */
    get expectancy(): number { return this._expectancy; }
    /**
     * Setter para el origen
     */
    set origin(newOrigin: Dimensions | Planets) {
        this._origin = newOrigin;
    }
    /**
     * Setter para el tipo
     */
    set type(newType: string) {
        this._type = newType;
    }
    /**
     * Setter para la esperanza de vida
     */
    set expectancy(newExpec: number) {
        this._expectancy = newExpec;
    }
}