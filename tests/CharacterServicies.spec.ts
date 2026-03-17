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
    characters.addCharacter(character1);
    characters.addCharacter(character2);
    characters.addCharacter(character3);
    characters.addCharacter(character4);
    characters.addCharacter(character5);
    expect(characters.getAll().length).toBe(5);
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
    characters.addCharacter(character1);
    characters.addCharacter(character2);
    characters.addCharacter(character3);
    characters.addCharacter(character4);
    characters.addCharacter(character5);
    expect(characters.removeCharacter("2")).toBe(true);
    expect(characters.removeCharacter("3")).toBe(true);
    expect(characters.removeCharacter("99")).toBe(false);
  });

  test('ModifiedCharacter', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const spec = new Species("JSC1", "humano", dimension, "humanoide", 80, "simple");
    const character1 = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 9, "protagonista");
    
    const characters = new CharacterServices();

    characters.addCharacter(character1);
    
    const all1: Character[] = characters.getAll();
    expect(all1.length).toBe(1);
    expect(all1[0].name).toBe("Rick Sanchez");
   
    expect(characters.modifyCharacter("1", "Rick Mod", undefined, undefined, "muerto")).toBe(true);

    const all2: Character[] = characters.getAll();
    expect(all2.length).toBe(1);
    expect(all2[0].name).toBe("Rick Mod");

    expect(characters.modifyCharacter("2", "Rick Prime", spec, dimension, "consejo de ricks", 10, "antagonista")).toBe(false);

    expect(characters.modifyCharacter("1", "Rick Prime", spec, dimension, "consejo de ricks", 10, "antagonista")).toBe(true);
  });

  test ("Consultas", () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const spec = new Species("JSC1", "humano", dimension, "humanoide", 80, "simple");
    const character1 = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 9, "protagonista");
    const character2 = new Character("2", "Rick Prime", spec, dimension, "vivo", "consejo de ricks", 10, "antagonista");
    const character3 = new Character("3", "Cop Rick", spec, dimension, "vivo", "consejo de ricks", 7, "secundario");
    const character4 = new Character("4", "Doofus Rick", spec, dimension, "vivo", "consejo de ricks", 6, "secundario");
    const character5 = new Character("5", "Simple Rick", spec, dimension, "vivo", "consejo de ricks", 8, "secundario");

    const characters = new CharacterServices();
    characters.addCharacter(character1);
    characters.addCharacter(character2);
    characters.addCharacter(character3);
    characters.addCharacter(character4);
    characters.addCharacter(character5);

    expect(characters.consultCharacterByName("Cop Rick")).toEqual([character3]);
    expect(characters.consultCharacterByAfilation("consejo de ricks", false, 1)).toEqual([
      character3,
      character4,
      character2,
      character1,
      character5,
    ]);
    expect(characters.consultCharacterByDimension(dimension, false, 2)).toEqual([
      character4,
      character3,
      character5,
      character1,
      character2,
    ]);
    expect(characters.consultCharacterBySpecies(spec, true, 2)).toEqual([
      character2,
      character1,
      character5,
      character3,
      character4,
    ]);
    expect(characters.consultCharacterByState("vivo", true, 1)).toEqual([
      character5,
      character1,
      character2,
      character4,
      character3,
    ]);
    expect(characters.consultCharacterByAfilation("humano", true, 1)).toEqual([]);
    expect(characters.consultCharacterByName("Jerry", false, 2)).toEqual([]);
  });
});