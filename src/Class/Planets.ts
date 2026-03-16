import { Dimensions } from "./Dimensions";
import { Attributes } from "./AbstractAttributes";

export class Planets extends Attributes{
    private _type: string;
    private _dimension: Dimensions;
    private _population: number;

    constructor( _id: string, _name: string, _type: string, _dimension: Dimensions, _population: number, _desc: string) {
        super(_id, _name, _desc)
        this._type = _type;
        this._dimension = _dimension;
        this._population = _population;
    }
}
