import { Species } from "./Species";
import { Dimensions } from "./Dimensions";
import { Attributes } from "./AbstractAttributes";

export class Character extends Attributes{
    private _species: Species;
    private _dimension: Dimensions;
    private _state: string;
    private _afiliation: string;
    private _iq: number;

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

    get species(): Species { return this._species; }

    get dimension(): Dimensions { return this._dimension; }

    get state(): string { return this._state; }

    get afiliation(): string { return this._afiliation; }

    get iq(): number { return this._iq; }

    set species(newSpec: Species) {
        this._species = newSpec;
    }

    set dimension(newDim: Dimensions) {
        this._dimension = newDim;
    }

    set state(newState: string) {
        this._state = newState;
    }

    set afiliation(newAfil: string) {
        this._afiliation = newAfil;
    }

    set iq(newIQ: number) {
        if (newIQ < 1 || newIQ > 10) {
            throw new Error("El nivel de inteligencia debe estar entre 1 y 10");
        }
        this._iq = newIQ;
    }
}