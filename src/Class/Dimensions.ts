import { DimensionState } from "../Enums/DimensionState";
import { Attributes } from "./AbstractAttributes";

export class Dimensions extends Attributes{
    private _state: DimensionState;
    private _techlevel: number;

    constructor( _id: string, _name: string, _state: DimensionState, _techlevel: number, _desc: string){
        super(_id, _name, _desc);
        this._state = _state;
        this._techlevel = _techlevel;
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