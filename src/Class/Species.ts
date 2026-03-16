import { Dimensions } from "./Dimensions";
import { Planets } from "./Planets";
import { Attributes } from "./AbstractAttributes";

export class Species extends Attributes {
    private _origin: Dimensions | Planets;
    private _type: string;
    private _expectancy: number;

    constructor( id:string, name: string, origin: Dimensions | Planets, type: string, expectancy: number, desc: string) {
        super(id, name, desc);
        this._origin = origin;
        this._type = type;
        this._expectancy = expectancy;
        
    }

    //Completar
}