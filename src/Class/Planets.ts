import { Dimensions } from "./Dimensions";

export class Planets {
    private _id: string;
    private _name: string;
    private _type: string;
    private _dimension: Dimensions;
    private _population: number;
    private _desc: string;

    constructor( _id: string, _name: string, _type: string, _dimension: Dimensions, _population: number, _desc: string) {
        this._id = _id;
        this._name = _name;
        this._type = _type;
        this._dimension = _dimension;
        this._population = _population;
        this._desc = _desc;
    }
}