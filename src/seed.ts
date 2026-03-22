import { db } from "./DataBase/db.js";
import { DimensionState } from "./Enums/DimensionState.js";
import { Dimensions } from "./Class/Dimensions.js";
import { Species } from "./Class/Species.js";
import { Invents } from "./Class/Invents.js";
import { Character } from "./Class/Character.js";
import { MultiverseManager } from "./Servicies/Multiverse.js";

async function runSeed() {
    console.log("Iniciando Multiverso");
    await db.read();

    // Limpiamos la base de datos
    db.data = { characters: [], dimensions: [], invents: [], planets: [], species: [], events: [] };

    // 1. GENERAR 15 DIMENSIONES
    const dims: Dimensions[] = [];
    dims.push(new Dimensions("D-C137", "Dimensión C-137", DimensionState.ACTIVA, 8, "Dimensión original de Rick"));
    dims.push(new Dimensions("D-Cronenberg", "Mundo Cronenberg", DimensionState.DESTRUIDA, 3, "Arruinada por poción"));
    for (let i = 3; i <= 15; i++) {
        dims.push(new Dimensions(`D-${i}`, `Dimensión Aleatoria ${i}`, DimensionState.ACTIVA, Math.floor(Math.random() * 10) + 1, "Generada"));
    }
    db.data.dimensions = dims;

    // 2. GENERAR 10 ESPECIES
    const species: Species[] = [];
    species.push(new Species("S-01", "Humano", dims[0], "Mamífero", 80, "Estándar"));
    species.push(new Species("S-02", "Gromflomite", dims[2], "Insectoide", 120, "Burócratas"));
    for (let i = 3; i <= 10; i++) {
        species.push(new Species(`S-${i}`, `Especie ${i}`, dims[3], "Desconocido", 100, "Genérica"));
    }
    db.data.species = species;

    // 3. GENERAR 15 INVENTOS
    const rick = new Character("C-01", "Rick Sanchez", species[0], dims[0], "Vivo", "Ninguna", 10, "Rick original");
    const invents: Invents[] = [];
    invents.push(new Invents("I-01", "Pistola de Portales", rick, "Viaje", 10, "Permite abrir portales a otras dimensiones"));
    invents.push(new Invents("I-02", "Caja Meeseeks", rick, "Asistentes temporales", 6, "Caja que contiene Meeseeks"));
    for (let i = 3; i <= 15; i++) {
        invents.push(new Invents(`I-${i}`, `Invento Genérico ${i}`, rick,"Generado", Math.floor(Math.random() * 10) + 1, "Descripción genérica"));
    }
    db.data.invents = invents;

    // 4. GENERAR 30 PERSONAJES (Añadimos varias versiones de Rick para probar los informes)
    const chars: Character[] = [];
    chars.push(new Character("C-01", "Rick Sanchez", species[0], dims[0], "Vivo", "Ninguna", 10, "Rick original"));
    chars.push(new Character("C-02", "Morty Smith", species[0], dims[0], "Vivo", "Ninguna", 4, "Morty original"));
    chars.push(new Character("C-03", "Rick Sanchez", species[0], dims[1], "Vivo", "Ciudadela", 9, "Rick de la dimensión destruida")); // Versión alternativa y huérfano
    for (let i = 4; i <= 30; i++) {
        chars.push(new Character(`C-${i}`, `Personaje Extra ${i}`, species[1], dims[2], "Vivo", "Federación", 5, "Generado"));
    }
    db.data.characters = chars;

    await db.write();
    const manager = new MultiverseManager(db);
    await manager.registerTravel("C-01", "D-C137", "D-3", "Buscando cristales mega");
    await manager.registerTravel("C-01", "D-3", "D-4", "Escapando de la federación");
    await manager.registerArtifactDeployment("I-01", "L-01", true); 
    
    console.log("El Multiverso está lleno de datos.");
}

runSeed();