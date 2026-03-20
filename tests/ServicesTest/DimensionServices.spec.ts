import { beforeEach, describe, expect, test } from "vitest";

import { Low } from "lowdb";
import { Data } from "../../src/DataBase/db";
import { JSONFilePreset } from "lowdb/node";
import { defaultData } from "../../src/DataBase/db";

import { DimensionServices } from "../../src/Servicies/DimensionServices";
import { Dimensions } from "../../src/Class/Dimensions";
import { DimensionState } from "../../src/Enums/DimensionState";

describe("Test para la clase DimensionServices (de Dimensiones)", () => {
  let dimension1: Dimensions;
  let dimension2: Dimensions;
  let dimensions: DimensionServices;

  beforeEach(async () => {
    let newdb: Low<Data> = await JSONFilePreset("src/DataBase/dbTest.json", defaultData); //Creamos nueva base de datos para los test, así no se sobreescribe la original
    
    dimension1 = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    dimension2 = new Dimensions("J19ζ7", "Dimensión Burbuja de Mantequilla", DimensionState.CUARENTENA, 5, "Dimensión experimental");

    newdb.data.dimensions = [dimension1];
    await newdb.write();

    dimensions= new DimensionServices(newdb);
  });

  test("Test para getAll, add y remove", async () => {
    await dimensions.add(dimension2);
    expect((await dimensions.getAll()).length).toBe(2);
    await expect(dimensions.add(dimension1)).rejects.toThrow("No se puede añadir esa dimensión porque ya existe");
    await dimensions.remove("C-137");
    expect((await dimensions.getAll()).length).toBe(1);
    await expect(dimensions.remove("No existe")).rejects.toThrow("No se puede eliminar una dimensión que no existe");
  });

  test("Test para las funciones de modificar", async () => {
    await dimensions.add(dimension2);

    await dimensions.modify("C-137",{ name: "Nombre modificado", state: DimensionState.CUARENTENA, techlevel: 10, desc: "Descripción modificada" });
    
    await dimensions.modify("J19ζ7",{name: "Nombre modificado"}); // Modificamos sólo un campo a la vez para que compruebe los undefined.
    await dimensions.modify("J19ζ7",{state: DimensionState.CUARENTENA});
    await dimensions.modify("J19ζ7",{techlevel: 10});
    await dimensions.modify("J19ζ7",{desc: "Descripción modificada"});

    const dim: Dimensions[] = await dimensions.getAll();
    expect(dim[0].id).toBe("C-137");
    expect(dim[0].name).toBe("Nombre modificado");
    expect(dim[0].state).toBe(DimensionState.CUARENTENA);
    expect(dim[0].techlevel).toBe(10);
    expect(dim[0].desc).toBe("Descripción modificada");

    const dimTrue = await dimensions.modify("C-137",{ name: "Nombre modificado", state: DimensionState.CUARENTENA, techlevel: 10, desc: "Descripción modificada" });
    expect(dimTrue).toBe(true);
    const dimFalse = await dimensions.modify("ID no válido",{ name: "Nombre modificado", state: DimensionState.CUARENTENA, techlevel: 10, desc: "Descripción modificada" });
    expect(dimFalse).toBe(false);
  });
});