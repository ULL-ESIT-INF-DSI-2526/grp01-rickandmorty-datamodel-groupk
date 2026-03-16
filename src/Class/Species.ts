import { Dimensions } from "./Dimensions";
import { Planets } from "./Planets";

export class Species {
    private _id: string;
    private _name: string;
    private _origin: Dimensions | Planets;
    private _type: string;
    private _expectancy: number;
    private _desc: string;

    constructor( _id:string, _name: string, _origin: Dimensions | Planets, _type: string, _expectancy: number, _desc: string) {
        this._id = _id;
        this._name = _name;
        this._origin = _origin;
        this._type = _type;
        this._expectancy = _expectancy;
        this._desc = _desc;
    }

    //Completar
}