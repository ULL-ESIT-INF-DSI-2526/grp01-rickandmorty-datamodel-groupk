import { DimensionState } from "../Enums/DimensionState";
import { Attributes } from "./AbstractAttributes";

export class Dimensions extends Attributes{
    private _state: DimensionState;
    private _techlevel: number;

    constructor( id: string, name: string, state: DimensionState, techlevel: number, desc: string){
        super(id, name, desc);
        if (!Object.values(DimensionState).includes(state)) {
            throw new Error("El estado de la dimensión no es válido")
        }
        this._state = state;
        if (techlevel < 1 || techlevel > 10) {
            throw new Error("El nivel de la tecnología tiene que estar entre 1 y 10")
        }
        this._techlevel = techlevel;
    }

    get state(): DimensionState { return this._state; }

    get techlevel(): number { return this._techlevel; }

    set state(state: DimensionState) {

        if (!Object.values(DimensionState).includes(state)) {
            throw new Error("El estado de la dimensión no es válido")
        }

        this._state = state;
    }

    set techlevel(level: number) {
        if (level < 1 || level > 10) {
            throw new Error("El nivel de la tecnología tiene que estar entre 1 y 10")
        }

        this._techlevel = level;
    }
}