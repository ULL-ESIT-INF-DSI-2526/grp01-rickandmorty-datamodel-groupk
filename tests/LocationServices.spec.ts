import { describe, expect, test } from "vitest";
import { LocationServices } from "../src/Servicies/LocationServicies"
import { Planets } from "../src/Class/Planets";
import { Dimensions } from "../src/Class/Dimensions";
import { DimensionState } from "../src/Enums/DimensionState";

const dimension = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
const location1 = new Planets("P-001", "Tierra C-137", "Planeta", dimension, 7800000000, "Planeta natal de Rick y Morty");
const locations = new LocationServices([]);

describe ("Test para la clase LocationServices", () => {
  test('add', () => {
    locations.add(location1);
    expect(locations.getAll().length).toBe(1);
  });
});