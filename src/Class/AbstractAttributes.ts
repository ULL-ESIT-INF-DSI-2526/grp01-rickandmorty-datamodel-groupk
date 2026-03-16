export abstract class Attributes {
    private _id: string;
    private _name: string;
    private _desc: string;

    constructor(id: string, name: string, desc: string) {
        this._id = id;
        this._name = name;
        this._desc = desc;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get desc(): string {
        return this._desc;
    }

    set name(name: string) {
        if (!name) throw new Error("El nombre no puede estar vacío");
        this._name = name;
    }

    set desc(desc: string) {
        this._desc = desc;
    }
}
