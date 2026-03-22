import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";

import { Character } from "../Class/Character.js";
import { Dimensions } from "../Class/Dimensions.js";
import { Invents } from "../Class/Invents.js";
import { Planets } from "../Class/Planets.js";
import { Species } from "../Class/Species.js";

/**
 * Para los tipos de eventos del multiverso
 */
export enum EventType {
    TRAVEL = "Viaje Interdimensional",
    DIMENSION_CHANGE = "Cambio en Dimensión",
    ARTIFACT_DEPLOYMENT = "Despliegue de Artefacto"
}

/**
 * Interfaz para registrar cualquier evento que ocurra en el multiverso
 */
export interface MultiverseEvent {
    id: string;
    type: EventType;
    date: string; 
    description: string;
    payload: Record<string, string>; // Guarda los IDs implicados (personaje, dimensión, invento...)
}

/**
 * Tipo de datos para formar la db
 */
export type Data = {
    characters: Character[];
    dimensions: Dimensions[];
    invents: Invents[];
    planets: Planets[];
    species: Species[];
    events: MultiverseEvent[]; 
}

/**
 * Base de datos por defecto
 */
export const defaultData: Data = {
    characters: [],
    dimensions: [],
    invents: [],
    planets: [],
    species: [],
    events: [] 
}

/**
 * Crea la base de datos con la estructura que le hemos dado
 */
export const db: Low<Data> = await JSONFilePreset<Data>("src/DataBase/db.json", defaultData);