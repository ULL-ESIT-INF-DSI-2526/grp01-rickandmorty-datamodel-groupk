import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";

import { Character } from "../Class/Character.js";
import { Dimensions } from "../Class/Dimensions.js";
import { Invents } from "../Class/Invents.js";
import { Planets } from "../Class/Planets.js";
import { Species } from "../Class/Species.js";

/**
 * Tipo de datos para formar la db
 */
export type Data = {
    characters: Character[];
    dimensions: Dimensions[];
    invents: Invents[];
    planets: Planets[];
    species: Species[];
}

/**
 * Base de datos por defecto
 */
export const defaultData: Data = {
    characters: [],
    dimensions: [],
    invents: [],
    planets: [],
    species: []
}

/**
 * Crea la bade de datos con la estructura que le hemos dado
 */
export const db: Low<Data> = await JSONFilePreset<Data>("src/DataBase/db.json", defaultData);