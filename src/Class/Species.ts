import { Dimensions } from "./Dimensions";
import { Planets } from "./Planets";
import { Attributes } from "./AbstractAttributes";

export class Species extends Attributes {
    private _origin: Dimensions | Planets;
    private _type: string;
    private _expectancy: number;

    constructor( _id:string, _name: string, _origin: Dimensions | Planets, _type: string, _expectancy: number, _desc: string) {
        super(_id, _name, _desc);
        this._origin = _origin;
        this._type = _type;
        this._expectancy = _expectancy;
        
    }

    //Completar
}