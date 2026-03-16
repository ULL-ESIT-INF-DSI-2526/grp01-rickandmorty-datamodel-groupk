import { describe, expect, test } from "vitest";
import { Dimensions } from "../src/Class/Dimensions";
import { DimensionState } from "../src/Enums/DimensionState";
import { Species } from "../src/Class/Species";

describe('Class Species', () => {
  test('Constructor', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const specie = new Species("123", "Gazorpiano", dimension, "amorfo", 50, "algo muy extraño");
    expect(specie.name).toBe("Gazorpiano");
    expect(specie.origin).toBe(dimension);
    expect(specie.expectancy).toEqual(50);
    expect(specie.desc).toBe("algo muy extraño");
  });

  test('Setters', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    const specie = new Species("123", "Gazorpiano", dimension, "amorfo", 50, "algo muy extraño");
    specie.name = "Cronenberg";
    specie.type = "Parásito";
    specie.expectancy = 70;
    expect(specie.name).toBe("Cronenberg");
    expect(specie.type).toBe("Parásito");
    expect(specie.expectancy).toEqual(70);
  })
});