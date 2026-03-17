import { DimensionState } from "../Enums/DimensionState";
import { Attributes } from "./AbstractAttributes";

/**
 * Clase para definir las dimensiones que extiende a la clase abstracta Attributes
 */
export class Dimensions extends Attributes{
    private _state: DimensionState;
    private _techlevel: number;

    /**
     * Constructor del objeto Dimensions
     * @param id - ID de la dimensión
     * @param name - Nombre de la dimensión
     * @param state - Estado de la dimensión, que puede ser Activa, Cuarentena o Destruida
     * @param techlevel - Nivel de tecnología de la dimensión que va entre 1-10
     * @param desc - Descripción de la dimensión
     */
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
    
    /**
     * Getter del estado
     */
    get state(): DimensionState { return this._state; }

    /**
     * Getter para el nivel de tecnología
     */
    get techlevel(): number { return this._techlevel; }

    /**
     * Setter para el estado, que comprueba que sea un estado válido
     */
    set state(state: DimensionState) {

        if (!Object.values(DimensionState).includes(state)) {
            throw new Error("El estado de la dimensión no es válido")
        }

        this._state = state;
    }

    /**
     * Setter para el nivel de tecnología que comprueba que esté entre 1 y 10
     */
    set techlevel(level: number) {
        if (level < 1 || level > 10) {
            throw new Error("El nivel de la tecnología tiene que estar entre 1 y 10")
        }

        this._techlevel = level;
    }
}