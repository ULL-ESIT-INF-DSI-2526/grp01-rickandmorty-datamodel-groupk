import { describe, expect, test } from "vitest";
import { Dimensions } from "../src/Class/Dimensions";
import { DimensionState } from "../src/Enums/DimensionState";

describe('Class Dimensions', () => {
  test('Constructor', () => {
    const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    expect(dimension.id).toBe("C-137");
    expect(dimension.name).toBe("Cronenberg");
    expect(dimension.state).toBe("Activa");
    expect(dimension.techlevel).toEqual(7);
    expect(dimension.desc).toBe("Dimension de prueba");
  });

  test('Setters', () => {
    let dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    dimension.state = DimensionState.CUARENTENA;
    dimension.techlevel = 9;
    expect(dimension.state).toBe("Cuarentena");
    expect(dimension.techlevel).toEqual(9);
  });

  test('Throw errors if needed', () => {
    let dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    expect(() => {
      dimension.state = DimensionState.ANIQUILADA;
    }).toThrowError("El estado de la dimensión no es válido");
    expect(() => {
      dimension.techlevel = 17;
    }).toThrowError("El nivel de la tecnología tiene que estar entre 1 y 10");
  });
});