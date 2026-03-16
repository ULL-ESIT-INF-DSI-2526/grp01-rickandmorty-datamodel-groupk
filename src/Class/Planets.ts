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

    get type(): string { return this._type; }

    get dimension(): Dimensions { return this._dimension; }

    get population(): number { return this._population; }

    set type(newType: string) {
        this._type = newType;
    }

    set dimension(newDim: Dimensions) {
        this._dimension = newDim;
    }

    set population(newPop: number) {
        this._population = newPop;
    }
}
