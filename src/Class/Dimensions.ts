import { DimensionState } from "../Enums/DimensionState";

export class Dimensions {
    private _id: string;
    private _name: string;
    private _state: DimensionState;
    private _techlevel: number;
    private _desc: string;

    constructor( _id: string, _name: string, _state: DimensionState, _techlevel: number, _desc: string){
        this._id = _id;
        this._name = _name;
        this._state = _state;
        this._techlevel = _techlevel;
        this._desc = _desc;
    }

    get_id(): string {
        return this._id;
    }

    get_name(): string {
        return this._name;
    }

    get_state(): DimensionState {
        return this._state;
    }

    get_techlevel(): number {
        return this._techlevel;
    }

    get_desc(): string {
        return this._desc;
    }

    set_name(name: string): void {

        if (name.length <= 0) {
            throw new Error("El nombre no puede estar vacío")
        }

        this._name = name;
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