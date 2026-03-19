import { describe, expect, test } from "vitest";
import { Invents } from "../src/Class/Invents";
import { Character } from "../src/Class/Character";
import { Species } from "../src/Class/Species";
import { Dimensions } from "../src/Class/Dimensions";
import { DimensionState } from "../src/Enums/DimensionState";

describe('Clase Invents', () => {
  const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
  const spec = new Species("JSC1", "humano", dimension, "humanoide", 80, "simple");
  const character = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 9, "protagonista");
  test('Constructor', () => {
    const invent = new Invents("12", "Portal Gun", character, "arma", 8, "pesada y potente");
    expect(invent.name).toBe("Portal Gun");
    expect(invent.inventor).toBe(character);
    expect(invent.type).toBe("arma");
    expect(invent.dangerLevel).toEqual(8);
    expect(invent.desc).toBe("pesada y potente");
  });

  test('Setters', () => {
    const character2 = new Character("1", "Otro Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 9, "protagonista");
    let invent = new Invents("12", "Portal Gun", character, "arma", 8, "pesada y potente");
    invent.name = "Megasiembra";
    invent.inventor = character2;
    invent.dangerLevel = 9;
    invent.type = "biotech";
    expect(invent.name).toBe("Megasiembra");
    expect(invent.inventor).toBe(character2);
    expect(invent.dangerLevel).toEqual(9);
    expect(invent.type).toBe("biotech");
  });

  test('Lanzamos errores si es necesario', () => {
    expect(() => {
      let invent = new Invents("12", "Portal Gun", character, "arma", 18, "pesada y potente");
    }).toThrowError("El nivel de peligrosidad debe estar entre 1 y 10");
    expect(() => {
      let invent = new Invents("12", "Portal Gun", character, "arma", 8, "pesada y potente");
      invent.dangerLevel = 18;
    }).toThrowError("El nivel de peligrosidad debe estar entre 1 y 10");
  });
});