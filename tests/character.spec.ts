import { describe, expect, test } from "vitest";
import { Dimensions } from "../src/Class/Dimensions";
import { DimensionState } from "../src/Enums/DimensionState";
import { Character } from "../src/Class/Character";
import { Species } from "../src/Class/Species";

describe('Class Character', () => {
  test('Constructor', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const spec = new Species("JSC1", "humano", dimension, "humanoide", 80, "simple");
    const character = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 9, "protagonista");
    expect(character.name).toBe("Rick Sanchez");
    expect(character.state).toBe("vivo");
    expect(character.iq).toEqual(9);
    expect(character.species).toBe(spec);
  });

  test('Setters', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const spec = new Species("JSC1", "humano", dimension, "humanoide", 80, "simple");
    let character = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 9, "protagonista");
    character.afiliation = "Federación Galáctica";
    character.iq = 10;
    expect(character.afiliation).toBe("Federación Galáctica");
    expect(character.iq).toEqual(10);
  });

  test('Throw errors if needed', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const spec = new Species("JSC1", "humano", dimension, "humanoide", 80, "simple");
    expect(() => {
      const character = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 120, "protagonista");
    }).toThrowError("El nivel de inteligencia debe estar entre 1 y 10");
  })
});
