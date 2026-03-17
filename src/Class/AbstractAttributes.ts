/**
 * Clase abstracta que contiene elementos comunes de las clases a las que será extendida.
 */
export abstract class Attributes {
    private _id: string;
    private _name: string;
    private _desc: string;

    /**
     * Constructor para la clase abstracta Attributes.
     * @param id - ID del objeto
     * @param name - Nombre del objeto
     * @param desc - Descripción del objeto
     */
    constructor(id: string, name: string, desc: string) {
        this._id = id;
        this._name = name;
        this._desc = desc;
    }

    /**
     * Getter de ID
     */
    get id(): string { return this._id; }

    /**
     * Getter del nombre
     */
    get name(): string { return this._name; }

    /**
     * Getter de la descripción
     */
    get desc(): string { return this._desc; }

    /**
     * Setter del nombre
     */
    set name(name: string) {
        if (!name) throw new Error("El nombre no puede estar vacío");
        this._name = name;
    }

    /**
     * Setter de la descripción
     */
    set desc(desc: string) {
        this._desc = desc;
    }
}
