import { describe, expect, test } from "vitest";
import { LocationServices } from "../src/Servicies/LocationServicies"
import { Planets } from "../src/Class/Planets";
import { Dimensions } from "../src/Class/Dimensions";
import { DimensionState } from "../src/Enums/DimensionState";

const dimension1 = new Dimensions("C-137", "Cronenberg", DimensionState.ACTIVA, 7, "Dimension de prueba");
const dimension2 = new Dimensions("J19ζ7", "Dimensión Burbuja de Mantequilla", DimensionState.CUARENTENA, 5, "Dimensión experimental");

describe ("Test para la clase LocationServices", () => {
  test(" Test para getAll, add y remove", () => {
    const location1 = new Planets("P-001", "Tierra C-137", "Planeta", dimension1, 7800000000, "Planeta natal de Rick y Morty");
    const location2 = new Planets("P-002", "Citadela de los Ricks", "Estación espacial", dimension2, 10000, "Centro de reunión de todos los Ricks");
    const locations = new LocationServices([location1]);
    locations.add(location2);
    expect(locations.getAll().length).toBe(2);
    locations.remove("P-001");
    expect(locations.getAll().length).toBe(1);
  });

  test("Test para las funciones de modificar", () => {
    const location1 = new Planets("P-001", "Tierra C-137", "Planeta", dimension1, 7800000000, "Planeta natal de Rick y Morty");
    const location2 = new Planets("P-002", "Citadela de los Ricks", "Estación espacial", dimension2, 10000, "Centro de reunión de todos los Ricks");
    const locations = new LocationServices([location1,location2]);

    locations.modify("P-001",{name: "Nombre modificado", type: "Tipo Estación", dimension: dimension2, population: 100, desc: "Localización modificada"});
    
    locations.modify("P-002",{name:"Loc 2"}); // Modificamos sólo un campo a la vez para que compruebe los undefined.
    locations.modify("P-002",{type:"Loc 2"});
    locations.modify("P-002",{dimension: dimension1});
    locations.modify("P-002",{population: 100});
    locations.modify("P-002",{desc:"Loc 2"});

    const loc: Planets[] = locations.getAll();
    expect(loc[0].id).toBe("P-001");
    expect(loc[0].name).toBe("Nombre modificado");
    expect(loc[0].type).toBe("Tipo Estación");
    expect(loc[0].dimension).toBe(dimension2);
    expect(loc[0].population).toBe(100);
    expect(loc[0].desc).toBe("Localización modificada");

    const locTrue = locations.modify("P-001",{name: "Nombre modificado", type: "Tipo Estación", dimension: dimension2, population: 100, desc: "Localización modificada"});
    expect(locTrue).toBe(true);
    const locFalse = locations.modify("ID no válido",{name: "Nombre modificado", type: "Tipo Estación", dimension: dimension2, population: 100, desc: "Localización modificada"});
    expect(locFalse).toBe(false);
  });
  
  test("Test para las funciones de consultas", () => {
    const location1 = new Planets("P-001", "Tierra C-137", "Planeta", dimension1, 7800000000, "Planeta natal de Rick y Morty");
    const location2 = new Planets("P-002", "Citadela de los Ricks", "Estación espacial", dimension2, 10000, "Centro de reunión de todos los Ricks");
    const locations = new LocationServices([location1, location2]);
    expect(locations.consultLocationByName("Citadela de los Ricks")).toStrictEqual([location2]);
    expect(locations.consultLocationByType("Estación espacial")).toStrictEqual([location2]);
    expect(locations.consultLocationByDimension(dimension2)).toStrictEqual([location2]);
  });
});