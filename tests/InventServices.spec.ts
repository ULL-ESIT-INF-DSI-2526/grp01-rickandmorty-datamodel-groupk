import { describe, expect, test } from "vitest";
import { LocationServices } from "../src/Servicies/InventServices"; 
import { Invents } from "../src/Class/Invents";
import { Character } from "../src/Class/Character";
import { Species } from "../src/Class/Species";
import { Dimensions } from "../src/Class/Dimensions";
import { DimensionState } from "../src/Enums/DimensionState";


const dimensionRick = new Dimensions("D-001", "C-137", DimensionState.ACTIVA, 10, "Dimensión original");
const dimensionMorty = new Dimensions("D-002", "Dimensión Cronenberg", DimensionState.CUARENTENA, 5, "Arruinada");

const humanSpecie = new Species("S-001", "Humano", dimensionRick, "Mamífero", 80, "Bípedo estándar");

const rick = new Character("C-001", "Rick Sanchez", humanSpecie, dimensionRick, "Vivo", "Ninguna", 10, "Científico genio");
const morty = new Character("C-002", "Morty Smith", humanSpecie, dimensionMorty, "Vivo", "Ninguna", 4, "Nieto influenciable");

const invent1 = new Invents("I-001", "Portal Gun", rick, "Transporte", 10, "Viaje interdimensional");
const invent2 = new Invents("I-002", "Plumbus", morty, "Hogar", 1, "Todos tienen uno");

describe("Test para la clase LocationServices", () => {
  test("Debe obtener todos, añadir y eliminar inventos correctamente", () => {
    const services = new LocationServices([invent1]);
    services.add(invent2);
    expect(services.getAll().length).toBe(2);
    services.remove("I-001");
    expect(services.getAll().length).toBe(1);
    expect(services.getAll()[0].id).toBe("I-002");
  });

  test("Debe modificar las propiedades de los inventos correctamente", () => {
    const inv1 = new Invents("I-001", "Portal Gun", rick, "Transporte", 10, "Original 1");
    const inv2 = new Invents("I-002", "Plumbus", morty, "Hogar", 1, "Original 2");
    const services = new LocationServices([inv1, inv2]);
    // Modificamos múltiples campos a la vez
    services.modify("I-001", { 
      name: "Pistola Rota", 
      type: "Arma", 
      inventor: morty, 
      dangerLevel: 9, 
      desc: "Va a explotar" 
    });
    // Modificamos campo a campo 
    services.modify("I-002", { name: "Mega Plumbus" });
    services.modify("I-002", { type: "Herramienta" });
    services.modify("I-002", { inventor: rick });
    services.modify("I-002", { dangerLevel: 5 });
    services.modify("I-002", { desc: "Más útil ahora" });
    const inventsList = services.getAll();
    // Comprobamos el primer invento
    expect(inventsList[0].id).toBe("I-001"); 
    expect(inventsList[0].name).toBe("Pistola Rota");
    expect(inventsList[0].type).toBe("Arma");
    expect(inventsList[0].inventor).toBe(morty);
    expect(inventsList[0].dangerLevel).toBe(9);
    expect(inventsList[0].desc).toBe("Va a explotar");
    // Comprobamos el segundo invento
    expect(inventsList[1].name).toBe("Mega Plumbus");
    expect(inventsList[1].type).toBe("Herramienta");
    expect(inventsList[1].inventor).toBe(rick);
    expect(inventsList[1].dangerLevel).toBe(5);
    expect(inventsList[1].desc).toBe("Más útil ahora");
    // Comprobamos los returns (true/false) del método modify
    const modificacionExitosa = services.modify("I-001", { name: "Test" });
    expect(modificacionExitosa).toBe(true);
    const modificacionFallida = services.modify("ID INVENTADO", { name: "Fallo" });
    expect(modificacionFallida).toBe(false);
  });

  test("Debe realizar consultas de inventos correctamente", () => {
    const services = new LocationServices([invent1, invent2]);
    expect(services.consultInventByName("Plumbus")).toStrictEqual([invent2]);
    expect(services.consultInventByType("Transporte")).toStrictEqual([invent1]);
    expect(services.consultInventByInventor(rick)).toStrictEqual([invent1]);
    expect(services.consultInventByDangerLevel(1)).toStrictEqual([invent2]);
  });
});