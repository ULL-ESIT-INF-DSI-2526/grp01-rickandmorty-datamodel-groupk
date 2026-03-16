import { Species } from "./Species";
import { Dimensions } from "./Dimensions";
import { Attributes } from "./AbstractAttributes";

export class Character extends Attributes{
    private _species: Species;
    private _dimension: Dimensions;
    private _state: string;
    private _afiliation: string;
    private _iq: number;

    constructor( _id:string, _name: string, _species: Species, _dimension: Dimensions, _state: string, _afiliation: string, _iq: number, _desc: string) {
        super(_id, _name, _desc);
        this._species = _species;
        this._dimension = _dimension;
        this._state = _state;
        this._afiliation = _afiliation;
        this._iq = _iq;
    }

    //Completar
}