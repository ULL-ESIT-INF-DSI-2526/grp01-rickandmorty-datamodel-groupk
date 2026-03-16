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

    get origin(): Dimensions | Planets { return this._origin; }

    get type(): string { return this._type; }

    get expectancy(): number { return this._expectancy; }

    set origin(newOrigin: Dimensions | Planets) {
        this._origin = newOrigin;
    }

    set type(newType: string) {
        this._type = newType;
    }

    set expectancy(newExpec: number) {
        this._expectancy = newExpec;
    }
}