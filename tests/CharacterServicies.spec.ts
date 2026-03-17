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
    const character = new Character("1", "Rick Sanchez", spec, dimension, "vivo", "consejo de ricks", 9, "protagonista");
    let characters = new CharacterServices();
    expect(characters.addCharacter(character)).toBe(true);
  });
});