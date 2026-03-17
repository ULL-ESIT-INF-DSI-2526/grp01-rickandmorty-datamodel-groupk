import { describe, expect, test } from "vitest";
import { Dimensions } from "../src/Class/Dimensions";
import { DimensionState } from "../src/Enums/DimensionState";
import { Planets } from "../src/Class/Planets";

describe('Class Planets', () => {
  test('Constructor', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const planet = new Planets("2", "Tierra C-137", "planeta", dimension, 123456, "tranquilo, vivo y activo");
    expect(planet.name).toBe("Tierra C-137");
    expect(planet.type).toBe("planeta");
    expect(planet.population).toEqual(123456);
    expect(planet.desc).toBe("tranquilo, vivo y activo");
    expect(planet.dimension).toBe(dimension);
  });

  test('Setters', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const dimension2 = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Otra dimensión de prueba");
    let planet = new Planets("2", "Tierra C-137", "planeta", dimension, 123456, "tranquilo, vivo y activo");
    planet.name = "Citadela de los Ricks";
    planet.type = "Estación espacial";
    planet.population = 1000000000;
    planet.dimension = dimension2;
    expect(planet.name).toBe("Citadela de los Ricks");
    expect(planet.type).toBe("Estación espacial");
    expect(planet.population).toEqual(1000000000);
    expect(planet.dimension).toBe(dimension2);
  })
});