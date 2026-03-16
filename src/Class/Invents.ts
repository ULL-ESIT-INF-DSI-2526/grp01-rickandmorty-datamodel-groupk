import { Attributes } from "./AbstractAttributes";

export class Invents extends Attributes {
  private _inventor: string;
  private _type: string;
  private _dangerlevel: number;
  constructor(id: string, name: string, inventor: string, type: string, danger: number, desc: string) {
    super(id, name, desc);
    this._inventor = inventor;
    this._type = type;
    if (danger < 1 || danger > 10) {
      throw new Error("El nivel de peligrosidad debe estar entre 1 y 10");
    }
    this._dangerlevel = danger;
  }

  get inventor(): string { return this._inventor; }

  get type(): string { return this._type; }

  get dangerLevel(): number { return this._dangerlevel; }

  set inventor(newInventor: string) {
    this._inventor = newInventor;
  }

  set type(newType: string) {
    this._type = newType;
  }

  set dangerLevel(newDanger: number) {
    if (newDanger < 1 || newDanger > 10) {
      throw new Error("El nivel de peligrosidad debe estar entre 1 y 10");
    }
    this._dangerlevel = newDanger;
  }
}