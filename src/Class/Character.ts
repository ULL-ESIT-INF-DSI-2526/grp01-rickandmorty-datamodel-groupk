import { Species } from "./Species";
import { Dimensions } from "./Dimensions";

export class Character {
    private _id: string;
    private _name: string;
    private _species: Species;
    private _dimension: Dimensions;
    private _state: string;
    private _afiliation: string;
    private _iq: number;
    private _desc: string;

    constructor( _id:string, _name: string, _species: Species, _dimension: Dimensions, _state: string, _afiliation: string, _iq: number, _desc: string) {
        this._id = _id;
        this._name = _name;
        this._species = _species;
        this._dimension = _dimension;
        this._state = _state;
        this._afiliation = _afiliation;
        this._iq = _iq;
        this._desc = _desc;
    }

    //Completar
}