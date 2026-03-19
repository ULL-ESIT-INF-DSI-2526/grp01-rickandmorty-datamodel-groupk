import { describe, expect, test } from "vitest";
import { Dimensions } from "../src/Class/Dimensions";
import { DimensionState } from "../src/Enums/DimensionState";
import { Character } from "../src/Class/Character";
import { Species } from "../src/Class/Species";

describe('Clase Character', () => {
  test('Constructor', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const spec = new Species("JSC1", "humano", dimension, "humanoide", 80, "simple");
    const character = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 9, "protagonista");
    expect(character.name).toBe("Rick Sanchez");
    expect(character.state).toBe("vivo");
    expect(character.iq).toEqual(9);
    expect(character.species).toBe(spec);
    expect(character.dimension).toBe(dimension);
    expect(character.desc).toBe("protagonista");
  });

  test('Setters', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const dimension2 = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Otra dimensión de prueba");
    const spec = new Species("JSC1", "humano", dimension, "humanoide", 80, "simple");
    let character = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 9, "protagonista");
    character.afiliation = "Federación Galáctica";
    character.iq = 10;
    character.species = new Species("JSC1", "humano", dimension, "humanoide", 80, "simple");
    character.dimension = dimension2;
    character.state = DimensionState.CUARENTENA;
    expect(character.afiliation).toBe("Federación Galáctica");
    expect(character.iq).toEqual(10);
    expect(character.dimension).toBe(dimension2);
    expect(character.state).toBe(DimensionState.CUARENTENA);
  });

  test('Lanzamos errores si es necesario', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const spec = new Species("JSC1", "humano", dimension, "humanoide", 80, "simple");
    let character = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 9, "protagonista");
    expect(() => {
      const character = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 120, "protagonista");
    }).toThrowError("El nivel de inteligencia debe estar entre 1 y 10");
    expect(() => {
      character.iq = 120;
    }).toThrowError("El nivel de inteligencia debe estar entre 1 y 10");
  })
});
