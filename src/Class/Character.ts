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
        this._iq = iq;
    }

    //Completar
}