import { beforeEach, describe, expect, test } from "vitest";

import { Low } from "lowdb";
import { Data } from "../../src/DataBase/db";
import { JSONFilePreset } from "lowdb/node";
import { defaultData } from "../../src/DataBase/db";

import { LocationServices } from "../../src/Servicies/LocationServicies"
import { Planets } from "../../src/Class/Planets";
import { Dimensions } from "../../src/Class/Dimensions";
import { DimensionState } from "../../src/Enums/DimensionState";

describe ("Test para la clase LocationServices", () => {
  let newdb: Low<Data>;
  let location1: Planets;
  let location2: Planets;
  let dimension1: Dimensions;
  let dimension2: Dimensions;
  let locations: LocationServices;


  beforeEach(async () => {
  let newdb: Low<Data> = await JSONFilePreset("src/DataBase/dbTest.json", defaultData); //Creamos nueva base de datos para los test, así no se sobreescribe la original
  
  dimension1 = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
  dimension2 = new Dimensions("J19ζ7", "Dimensión Burbuja de Mantequilla", DimensionState.CUARENTENA, 5, "Dimensión experimental");
  location1 = new Planets("P-001", "Tierra C-137", "Planeta", dimension1, 7800000000, "Planeta natal de Rick y Morty");
  location2 = new Planets("P-002", "Citadela de los Ricks", "Estación espacial", dimension2, 10000, "Centro de reunión de todos los Ricks");

  newdb.data.planets = [location1];
  await newdb.write();

  locations = new LocationServices(newdb);
  });

  test(" Test para getAll, add y remove", async () => {
    await locations.add(location2);
    expect((await locations.getAll()).length).toBe(2);
    expect(locations.add(location1)).rejects.toThrow("No se puede añadir esa localización porque ya existe");
    await locations.remove("P-001");
    expect((await locations.getAll()).length).toBe(1);
    expect(locations.remove("No existe")).rejects.toThrow("No se puede eliminar una localización que no existe");
  });

  test("Test para las funciones de modificar", async () => {
    await locations.add(location2);

    await locations.modify("P-001",{name: "Nombre modificado", type: "Tipo Estación", dimension: dimension2, population: 100, desc: "Localización modificada"});
    
    await locations.modify("P-002",{name:"Loc 2"}); // Modificamos sólo un campo a la vez para que compruebe los undefined.
    await locations.modify("P-002",{type:"Loc 2"});
    await locations.modify("P-002",{dimension: dimension1});
    await locations.modify("P-002",{population: 100});
    await locations.modify("P-002",{desc:"Loc 2"});

    const loc: Planets[] = await locations.getAll();
    expect(loc[0].id).toBe("P-001");
    expect(loc[0].name).toBe("Nombre modificado");
    expect(loc[0].type).toBe("Tipo Estación");
    expect(loc[0].dimension).toBe(dimension2);
    expect(loc[0].population).toBe(100);
    expect(loc[0].desc).toBe("Localización modificada");

    const locTrue = await locations.modify("P-001",{name: "Nombre modificado", type: "Tipo Estación", dimension: dimension2, population: 100, desc: "Localización modificada"});
    expect(locTrue).toBe(true);
    const locFalse = await locations.modify("ID no válido",{name: "Nombre modificado", type: "Tipo Estación", dimension: dimension2, population: 100, desc: "Localización modificada"});
    expect(locFalse).toBe(false);
  });
  
  test("Test para las funciones de consultas", async () => {
    //await locations.add(location1);
    await locations.add(location2);
    expect(await locations.consultLocationByName("Citadela de los Ricks")).toStrictEqual([location2]);
    expect(await locations.consultLocationByType("Estación espacial")).toStrictEqual([location2]);
    expect(await locations.consultLocationByDimension(dimension2)).toStrictEqual([location2]);
  });
});