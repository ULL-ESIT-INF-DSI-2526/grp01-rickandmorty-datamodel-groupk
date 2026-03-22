import { beforeEach, describe, expect, test } from "vitest";
import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";

import { Data, EventType } from "../../src/DataBase/db";
import { defaultData } from "../../src/DataBase/db";
import { MultiverseManager } from "../../src/Servicies/Multiverse"; 
import { Character } from "../../src/Class/Character";
import { Dimensions } from "../../src/Class/Dimensions";
import { Species } from "../../src/Class/Species";
import { Invents } from "../../src/Class/Invents";
import { DimensionState } from "../../src/Enums/DimensionState";

describe("Test para la clase MultiverseManager (Gestor Global)", () => {
    let dimActiva1: Dimensions;
    let dimActiva2: Dimensions;
    let dimDestruida: Dimensions;
    let dimFantasma: Dimensions; 

    let species: Species;

    let rickC137: Character;
    let rickCronenberg: Character; 
    let jerry: Character; 

    let portalGun: Invents;
    let meeseeksBox: Invents;

    let manager: MultiverseManager;

    beforeEach(async () => {
        // 1. Base de datos limpia para cada test
        let newdb: Low<Data> = await JSONFilePreset("src/DataBase/dbTestMultiverse.json", defaultData);
        newdb.data = { characters: [], dimensions: [], invents: [], planets: [], species: [], events: [] };

        // 2. Instanciamos Dimensiones
        dimActiva1 = new Dimensions("D-01", "C-137", DimensionState.ACTIVA, 10, "Dim. Principal");
        dimActiva2 = new Dimensions("D-02", "Ciudadela", DimensionState.ACTIVA, 8, "Sede");
        dimDestruida = new Dimensions("D-03", "Cronenberg", DimensionState.DESTRUIDA, 5, "Arruinada");
        dimFantasma = new Dimensions("D-04", "Dimensión Borrada", DimensionState.CUARENTENA, 1, "No en BD");

        // 3. Especies e Inventos
        species = new Species("S-01", "Humano", dimActiva1, "Mamífero", 80, "Estándar");
        portalGun = new Invents("I-01", "Pistola de Portales", rickC137, "Viajes",10, "Permite viajar entre dimensiones");
        meeseeksBox = new Invents("I-02", "Caja Meeseeks", rickC137, "Ayudantes", 5, "Crea seres para cumplir tareas, pero pueden volverse peligrosos si se les da una tarea imposible");

        // 4. Personajes (RickC137 y RickCronenberg tienen el MISMO nombre para probar alternativas)
        rickC137 = new Character("C-01", "Rick Sanchez", species, dimActiva1, "Vivo", "Ninguna", 10, "");
        rickCronenberg = new Character("C-02", "Rick Sanchez", species, dimDestruida, "Vivo", "Ninguna", 9, "");
        jerry = new Character("C-03", "Jerry Smith", species, dimFantasma, "Vivo", "Familia", 2, "");

        // 5. Poblamos la base de datos con estas entidades para que el gestor pueda operar sobre ellas
        newdb.data.dimensions = [dimActiva1, dimActiva2, dimDestruida];
        newdb.data.characters = [rickC137, rickCronenberg, jerry];
        newdb.data.invents = [portalGun, meeseeksBox];
        await newdb.write();

        // 6. Iniciamos el gestor
        manager = new MultiverseManager(newdb);
    });

    test("Debe detectar correctamente a los personajes huérfanos", async () => {
        const orphans = await manager.checkOrphanCharacters();
        expect(orphans.length).toBe(2);
        
        const orphanIds = orphans.map(o => o.id);
        expect(orphanIds).toContain("C-02"); // Rick Cronenberg
        expect(orphanIds).toContain("C-03"); // Jerry
        expect(orphanIds).not.toContain("C-01"); // Rick C-137 NO es huérfano
    });

    test("Debe registrar eventos correctamente en la base de datos", async () => {
        await manager.registerTravel("C-01", "D-01", "D-02", "Buscando szechuan");
        await manager.registerDimensionAnomaly("D-03", true, "Experimento fallido");
        // Comprobamos directamente los arrays de la instancia (gracias a que manager usa newdb por referencia)
        const history = await manager.getCharacterTravelHistory("C-01");
        expect(history.length).toBe(1);
        expect(history[0].type).toBe(EventType.TRAVEL);
        expect(history[0].payload.reason).toBeUndefined(); 
        expect(history[0].payload.toDimId).toBe("D-02");
    });

    test("Debe generar el informe de dimensiones activas y calcular la media tecnológica", async () => {
        const report = await manager.getActiveDimensionsReport();
        expect(report.activeDimensions.length).toBe(3);
        expect(report.averageTechLevel).toBeCloseTo(7.6666);
    });

    test("Debe encontrar personajes con mayor número de versiones alternativas", async () => {
        const report = await manager.getCharactersWithMostVersions();
        expect(report.length).toBe(1);
        expect(report[0].name).toBe("Rick Sanchez");
        expect(report[0].count).toBe(2);
    });

    test("Debe calcular los inventos más peligrosos desplegados correctamente", async () => {
        await manager.registerArtifactDeployment("I-01", "L-01", true);
        await manager.registerArtifactDeployment("I-02", "L-02", true);
        await manager.registerArtifactDeployment("I-02", "L-02", false);
        const dangerous = await manager.getMostDangerousDeployedArtifacts();
        // Solo debería quedar la pistola (I-01) desplegada
        expect(dangerous.length).toBe(1);
        expect(dangerous[0].invent.id).toBe("I-01");
        expect(dangerous[0].invent.dangerLevel).toBe(10);
        expect(dangerous[0].locationId).toBe("L-01");
    });

    test("Debe devolver el historial de viajes ordenado cronológicamente", async () => {
        // Forzamos un pequeño retraso para asegurar diferencias de tiempo entre los Date.now()
        await manager.registerTravel("C-01", "D-01", "D-02", "Viaje 1");
        await new Promise(r => setTimeout(r, 10)); 
        await manager.registerTravel("C-01", "D-02", "D-03", "Viaje 2");

        const history = await manager.getCharacterTravelHistory("C-01");        
        expect(history.length).toBe(2);
        expect(history[0].description).toContain("Viaje 2");
        expect(history[1].description).toContain("Viaje 1");
    });
});