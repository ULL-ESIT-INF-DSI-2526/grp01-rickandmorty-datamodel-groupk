import { Attributes } from "./AbstractAttributes";
import { Character } from "./Character";

export class Invents extends Attributes {
  private _inventor: Character;
  private _type: string;
  private _dangerlevel: number;

  /**
   * Constructor para el objeto Invents
   * @param id - ID del invento
   * @param name - Nombre del invento
   * @param inventor - Personaje que crea el invento, es del tipo Character
   * @param type - Tipo del invento
   * @param danger - Nivel de peligro del invento que va entre 1 y 10
   * @param desc - Descripción del invento
   */
  constructor(id: string, name: string, inventor: Character, type: string, danger: number, desc: string) {
    super(id, name, desc);
    this._inventor = inventor;
    this._type = type;
    if (danger < 1 || danger > 10) {
      throw new Error("El nivel de peligrosidad debe estar entre 1 y 10");
    }
    this._dangerlevel = danger;
  }

  /**
   * Getter para el inventor
   */
  get inventor(): Character { return this._inventor; }

  /**
   * Getter para el tipo 
   */
  get type(): string { return this._type; }

  /**
   * Getter para el nivel de peligro
   */
  get dangerLevel(): number { return this._dangerlevel; }

  /**
   * Setter del inventor
   */
  set inventor(newInventor: Character) {
    this._inventor = newInventor;
  }

  /**
   * Setter para el tipo
   */
  set type(newType: string) {
    this._type = newType;
  }

  /**
   * Setter para el nivel de peligro
   */
  set dangerLevel(newDanger: number) {
    if (newDanger < 1 || newDanger > 10) {
      throw new Error("El nivel de peligrosidad debe estar entre 1 y 10");
    }
    this._dangerlevel = newDanger;
  }
}