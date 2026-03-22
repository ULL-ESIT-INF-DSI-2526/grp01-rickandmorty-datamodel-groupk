import { beforeEach, describe, expect, test } from "vitest";

import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { Data, defaultData } from "../../src/DataBase/db";

import { CharacterServices } from "../../src/Servicies/CharacterServicies";
import { Character } from "../../src/Class/Character";
import { Dimensions } from "../../src/Class/Dimensions";
import { Species } from "../../src/Class/Species";
import { DimensionState } from "../../src/Enums/DimensionState";

describe("Tests para la clase CharacterServices ", () => {
  let dimension1: Dimensions;
  let dimension2: Dimensions;
  let species1: Species;
  let species2: Species;
  let character1: Character;
  let character2: Character;
  let character3: Character;
  let character4: Character;
  let characters: CharacterServices;

  beforeEach(async () => {
    let newdb: Low<Data> = await JSONFilePreset("src/DataBase/dbTest.json", defaultData); 
    
    dimension1 = new Dimensions("D-001", "C-137", DimensionState.ACTIVA, 10, "Dimensión principal");
    dimension2 = new Dimensions("D-002", "Dimensión Cronenberg", DimensionState.CUARENTENA, 5, "Destruida");

    species1 = new Species("S-001", "Humano", dimension1, "Mamífero", 80, "Bípedo estándar");
    species2 = new Species("S-002", "Gromflomite", dimension2, "Insectoide", 150, "Burocrátas");

    character1 = new Character("C-001", "Rick Sanchez", species1, dimension1, "Vivo", "Ninguna", 10, "Genio");
    character2 = new Character("C-002", "Morty Smith", species1, dimension1, "Vivo", "Ninguna", 4, "Nieto");
    character3 = new Character("C-003", "Krombopulos Michael", species2, dimension2, "Muerto", "Asesinos", 6, "Le encanta matar");
    character4 = new Character("C-004", "Rick Sanchez", species1, dimension2, "Vivo", "Ninguna", 10, "Versión alternativa");

    newdb.data.characters = [character1];
    await newdb.write();
    characters = new CharacterServices(newdb);
  });

  test("Test para getAll, add y remove", async () => {
    await characters.add(character2);
    expect((await characters.getAll()).length).toBe(2);
    await expect(characters.add(character1)).rejects.toThrow("No se puede añadir ese personaje porque ya existe");
    await characters.remove("C-001");
    expect((await characters.getAll()).length).toBe(1);
    await expect(characters.remove("No existe")).rejects.toThrow("No se puede eliminar un personaje que no existe");
  });

  test("Test para las funciones de modificar", async () => {
    await characters.add(character2);
    await characters.modify("C-001", { 
      name: "Rick Pepinillo", 
      species: species2, 
      dimension: dimension2, 
      state: "Convertido", 
      afiliation: "Solitario", 
      iq: 9, 
      desc: "Es un pepinillo" 
    });
    // Modificamos sólo un campo a la vez en character2 para que compruebe los undefined
    await characters.modify("C-002", { name: "Morty Malvado" });
    await characters.modify("C-002", { state: "Desconocido" });
    await characters.modify("C-002", { afiliation: "Presidente" });
    await characters.modify("C-002", { iq: 10 });
    await characters.modify("C-002", { desc: "Muy listo" });
    const chars: Character[] = await characters.getAll();
    // Comprobamos character1
    expect(chars[0].id).toBe("C-001");
    expect(chars[0].name).toBe("Rick Pepinillo");
    expect(chars[0].species.id).toBe("S-002");
    expect(chars[0].dimension.id).toBe("D-002");
    expect(chars[0].state).toBe("Convertido");
    expect(chars[0].afiliation).toBe("Solitario");
    expect(chars[0].iq).toBe(9);
    expect(chars[0].desc).toBe("Es un pepinillo");
    // Comprobamos los returns booleanos
    const modTrue = await characters.modify("C-001", { name: "Rick" });
    expect(modTrue).toBe(true);
    const modFalse = await characters.modify("ID no válido", { name: "Fallo" });
    expect(modFalse).toBe(false);
  });

  test("Test para las consultas", async () => {
    await characters.add(character2); 
    await characters.add(character3); 
    
    const mortySearch = await characters.consultCharacterByName("Morty Smith");
    expect(mortySearch.length).toBe(1);
    expect(mortySearch[0].id).toBe("C-002");

    const humanSearch = await characters.consultCharacterBySpecies(species1);
    expect(humanSearch.length).toBe(2); // Rick y Morty

    const characteraff = await characters.consultCharacterByAfilation("Asesinos");
    expect(character3.afiliation).toBe("Asesinos");

    const byNameAsc = await characters.consultCharacterByState("Vivo", false, 1);
    expect(byNameAsc.length).toBe(2);
    expect(byNameAsc[0].name).toBe("Morty Smith"); 
    expect(byNameAsc[1].name).toBe("Rick Sanchez");

    const allInDim1 = await characters.consultCharacterByDimension(dimension1); 
    expect(allInDim1[0].name).toBe("Rick Sanchez"); // IQ más alto primero al ser desc
    expect(allInDim1[1].name).toBe("Morty Smith");
  });

  test("Test para versiones alternativas de un personaje", async () => {
    await characters.add(character2); 
    await characters.add(character3); 
    await characters.add(character4); 

    const alt = await characters.findAlternativeVersions("Rick Sanchez");
    expect(alt.length).toBe(2);
  });

  test("Test para versiones alternativas de un personaje", async () => {
    await characters.add(character2); 
    await characters.add(character3); 
    await characters.add(character4); 

    const char = await characters.getAll();

    const apply = await characters.applySorting(char, true, 1);
    const apply2 = await characters.applySorting(char, true, 2);
    expect(apply[0].name).toBe("Rick Sanchez");
    expect(apply2[0].iq).toBe(10);

    const iqsort = await characters.sortByIq(char, false);
    expect(iqsort[0].iq).toBe(4);
  });

});