import { describe, expect, test } from "vitest";
import {CharacterServices} from "../src/Servicies/CharacterServicies";
import { Dimensions } from "../src/Class/Dimensions";
import { DimensionState } from "../src/Enums/DimensionState";
import { Character } from "../src/Class/Character";
import { Species } from "../src/Class/Species";

describe ("class CharacterServicies", () => {
  test('AddCharacter', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const spec = new Species("JSC1", "humano", dimension, "humanoide", 80, "simple");
    const character1 = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 9, "protagonista");
    const character2 = new Character("2", "Rick Prime", spec, dimension, "vivo", "consejo de ricks", 10, "antagonista");
    const character3 = new Character("3", "Cop Rick", spec, dimension, "vivo", "consejo de ricks", 7, "secundario");
    const character4 = new Character("4", "Doofus Rick", spec, dimension, "vivo", "consejo de ricks", 6, "secundario");
    const character5 = new Character("5", "Simple Rick", spec, dimension, "vivo", "consejo de ricks", 8, "secundario");

    const characters = new CharacterServices();
    expect(characters.addCharacter(character1)).toBe(true);
    expect(characters.addCharacter(character2)).toBe(true);
    expect(characters.addCharacter(character3)).toBe(true);
    expect(characters.addCharacter(character4)).toBe(true);
    expect(characters.addCharacter(character5)).toBe(true);
  });

  test('RemoveCharacter', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const spec = new Species("JSC1", "humano", dimension, "humanoide", 80, "simple");
    const character1 = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 9, "protagonista");
    const character2 = new Character("2", "Rick Prime", spec, dimension, "vivo", "consejo de ricks", 10, "antagonista");
    const character3 = new Character("3", "Cop Rick", spec, dimension, "vivo", "consejo de ricks", 7, "secundario");
    const character4 = new Character("4", "Doofus Rick", spec, dimension, "vivo", "consejo de ricks", 6, "secundario");
    const character5 = new Character("5", "Simple Rick", spec, dimension, "vivo", "consejo de ricks", 8, "secundario");

    const characters = new CharacterServices();
    expect(characters.addCharacter(character1)).toBe(true);
    expect(characters.addCharacter(character2)).toBe(true);
    expect(characters.addCharacter(character3)).toBe(true);
    expect(characters.addCharacter(character4)).toBe(true);
    expect(characters.addCharacter(character5)).toBe(true);
    expect(characters.removeCharacter("2")).toBe(true);
    expect(characters.removeCharacter("3")).toBe(true);
  });

  test('ModifiedCharacter', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const spec = new Species("JSC1", "humano", dimension, "humanoide", 80, "simple");
    const character1 = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 9, "protagonista");
    
    const characters = new CharacterServices();

    expect(characters.addCharacter(character1)).toBe(true);
    
    const all1: Character[] = characters.getAll();
    expect(all1.length).toBe(1);
    expect(all1[0].name).toBe("Rick Sanchez");
    
   
   
    expect(characters.modifyCharacter("1", "Rick Mod", undefined, undefined, "muerto")).toBe(true);

    const all2: Character[] = characters.getAll();
    expect(all2.length).toBe(1);
    expect(all2[0].name).toBe("Rick Mod");
  });
});