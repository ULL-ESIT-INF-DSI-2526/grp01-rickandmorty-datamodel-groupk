import { describe, expect, test } from "vitest";
import { LocationServices } from "../src/Servicies/DimensionServices";
import { Dimensions } from "../src/Class/Dimensions";
import { DimensionState } from "../src/Enums/DimensionState";

const dimension1 = new Dimensions("D-001", "C-137", DimensionState.ACTIVA, 7, "Dimensión de prueba");
const dimension2 = new Dimensions("D-002", "J19ζ7", DimensionState.CUARENTENA, 5, "Dimensión experimental");

describe("Test para la clase LocationServices (de Dimensiones)", () => {
  test("Test para getAll, add y remove", () => {
    const locations = new LocationServices([dimension1]);
    locations.add(dimension2);
    expect(locations.getAll().length).toBe(2);
    locations.remove("D-001");
    expect(locations.getAll().length).toBe(1);
    expect(locations.getAll()[0].id).toBe("D-002");
  });

  test("Test para las funciones de modificar", () => {
    const dim1 = new Dimensions("D-001", "C-137", DimensionState.ACTIVA, 7, "Original 1");
    const dim2 = new Dimensions("D-002", "J19ζ7", DimensionState.CUARENTENA, 5, "Original 2");
    const locations = new LocationServices([dim1, dim2]);
    // Modificamos la primera dimensión con múltiples campos a la vez
    locations.modify("D-001", { 
      name: "Nombre modificado", 
      state: DimensionState.CUARENTENA, 
      techlevel: 10, 
      desc: "Descripción modificada" 
    });
    locations.modify("D-002", { name: "Dim 2" });
    locations.modify("D-002", { state: DimensionState.ACTIVA });
    locations.modify("D-002", { techlevel: 1 });
    locations.modify("D-002", { desc: "Desc 2" });
    // Comprobamos la primera dimensión (modificaciones múltiples)
    const loc: Dimensions[] = locations.getAll();
    expect(loc[0].id).toBe("D-001"); 
    expect(loc[0].name).toBe("Nombre modificado");
    expect(loc[0].state).toBe(DimensionState.CUARENTENA);
    expect(loc[0].techlevel).toBe(10);
    expect(loc[0].desc).toBe("Descripción modificada");
    // Comprobamos la segunda dimensión (modificaciones individuales)
    expect(loc[1].name).toBe("Dim 2");
    expect(loc[1].state).toBe(DimensionState.ACTIVA);
    expect(loc[1].techlevel).toBe(1);
    expect(loc[1].desc).toBe("Desc 2");
    // Comprobamos el valor del return de modify
    const locTrue = locations.modify("D-001", { name: "Otro nombre" });
    expect(locTrue).toBe(true);
    const locFalse = locations.modify("ID no válido", { name: "Fallo" });
    expect(locFalse).toBe(false);
  });
});