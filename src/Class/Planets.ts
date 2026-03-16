import { Dimensions } from "./Dimensions";
import { Attributes } from "./AbstractAttributes";

export class Planets extends Attributes{
    private _type: string;
    private _dimension: Dimensions;
    private _population: number;

    constructor( id: string, name: string, type: string, dimension: Dimensions, population: number, desc: string) {
        super(id, name, desc)
        this._type = type;
        this._dimension = dimension;
        this._population = population;
    }

    //Completar
}
