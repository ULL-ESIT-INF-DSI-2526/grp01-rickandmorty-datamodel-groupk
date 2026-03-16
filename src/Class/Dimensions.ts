import { DimensionState } from "../Enums/DimensionState";
import { Attributes } from "./AbstractAttributes";

export class Dimensions extends Attributes{
    private _state: DimensionState;
    private _techlevel: number;

    constructor( id: string, name: string, state: DimensionState, techlevel: number, desc: string){
        super(id, name, desc);
        this._state = state;
        this._techlevel = techlevel;
    }

    get_state(): DimensionState {
        return this._state;
    }

    get_techlevel(): number {
        return this._techlevel;
    }

    set_state(state: DimensionState): void {

        if (!Object.values(DimensionState).includes(state)) {
            throw new Error("El estado de la dimensión no es válido")
        }

        this._state = state;
    }

    set_techlevel(level: number): void {
        if (level < 1 || level > 10) {
            throw new Error("El nivel de la tecnología tiene que estar entre 1 y 10")
        }

        this._techlevel = level;
    }
}