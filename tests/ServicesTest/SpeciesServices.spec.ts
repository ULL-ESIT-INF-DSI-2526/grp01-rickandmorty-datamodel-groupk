import { beforeEach, describe, expect, test } from "vitest";

import { Low } from "lowdb";
import { Data } from "../../src/DataBase/db";
import { JSONFilePreset } from "lowdb/node";
import { defaultData } from "../../src/DataBase/db";

import { Species } from "../../src/Class/Species";
import { SpeciesServices } from "../../src/Servicies/SpeciesServices"
import { Dimensions } from "../../src/Class/Dimensions";
import { DimensionState } from "../../src/Enums/DimensionState";

describe("Test para la clase DimensionServices (de Dimensiones)", () => {
  let dimension1: Dimensions;
  let dimension2: Dimensions;
  let specie1: Species;
  let specie2: Species;
  let species: SpeciesServices;

  beforeEach(async () => {
    let newdb: Low<Data> = await JSONFilePreset("src/DataBase/dbTest.json", defaultData); //Creamos nueva base de datos para los test, así no se sobreescribe la original
    
    dimension1 = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
    dimension2 = new Dimensions("J19ζ7", "Dimensión Burbuja de Mantequilla", DimensionState.CUARENTENA, 5, "Dimensión experimental");
    specie1 = new Species("123", "Gazorpiano", dimension1, "amorfo", 50, "algo muy extraño");
    specie2 = new Species("S1", "Humano", dimension1, "Humanoide", 80, "Común");

    newdb.data.species = [specie1];
    await newdb.write();

    species = new SpeciesServices(newdb);
  });

  test("Test para getAll, add y remove", async () => {
    await species.add(specie2);
    expect((await species.getAll()).length).toBe(2);
    expect(species.add(specie1)).rejects.toThrow("No se puede añadir esa especie porque ya existe");
    await species.remove("123");
    expect((await species.getAll()).length).toBe(1);
    expect(species.remove("No existe")).rejects.toThrow("No se puede eliminar una especie que no existe");
  });

  test("Test para las funciones de modificar", async () => {
    await species.add(specie2);

    await species.modify("123",{ name: "Meeseeks", origin: dimension2, type: "Artificial", expectancy: 1, desc: "Temporal" });
    
    await species.modify("123",{name: "Meeseeks"}); // Modificamos sólo un campo a la vez para que compruebe los undefined.
    await species.modify("123",{origin: dimension2});
    await species.modify("123",{type: "Artificial"});
    await species.modify("123",{expectancy: 1});
    await species.modify("123",{desc: "Temporal"});

    const spc: Species[] = await species.getAll();
    expect(spc[0].id).toBe("123");
    expect(spc[0].name).toBe("Meeseeks");
    expect(spc[0].origin).toBe(dimension2);
    expect(spc[0].type).toBe("Artificial");
    expect(spc[0].expectancy).toBe(1);
    expect(spc[0].desc).toBe("Temporal");

    const dimTrue = await species.modify("123",{ name: "Meeseeks", origin: dimension2, type: "Artificial", expectancy: 1, desc: "Temporal" });
    expect(dimTrue).toBe(true);
    const dimFalse = await species.modify("ID no válido",{ name: "Meeseeks", origin: dimension2, type: "Artificial", expectancy: 1, desc: "Temporal" });
    expect(dimFalse).toBe(false);
  });
});