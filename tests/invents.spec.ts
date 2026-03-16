import { describe, expect, test } from "vitest";
import { Invents } from "../src/Class/Invents";

describe('Class Invents', () => {
  test('Constructor', () => {
    const invent = new Invents("12", "Portal Gun", "Rick Sanchez", "arma", 8, "pesada y potente");
    expect(invent.name).toBe("Portal Gun");
    expect(invent.inventor).toBe("Rick Sanchez");
    expect(invent.type).toBe("arma");
    expect(invent.dangerLevel).toEqual(8);
    expect(invent.desc).toBe("pesada y potente");
  });

  test('Setters', () => {
    let invent = new Invents("12", "Portal Gun", "Rick Sanchez", "arma", 8, "pesada y potente");
    invent.name = "Megasiembra";
    invent.inventor = "Morty Smith";
    invent.dangerLevel = 9;
    expect(invent.name).toBe("Megasiembra");
    expect(invent.inventor).toBe("Morty Smith");
    expect(invent.dangerLevel).toEqual(9);
  });

  test('Throw errors if needed', () => {
    expect(() => {
      let invent = new Invents("12", "Portal Gun", "Rick Sanchez", "arma", 18, "pesada y potente");
    }).toThrowError("El nivel de peligrosidad debe estar entre 1 y 10");
  });
});