import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";

import { Character } from "../Class/Character.js";
import { Dimensions } from "../Class/Dimensions.js";
import { Invents } from "../Class/Invents.js";
import { Planets } from "../Class/Planets.js";
import { Species } from "../Class/Species.js";

export type Data = {
    characters: Character[];
    dimensions: Dimensions[];
    invents: Invents[];
    planets: Planets[];
    species: Species[];
}

export const defaultData: Data = {
    characters: [],
    dimensions: [],
    invents: [],
    planets: [],
    species: []
}

export const db: Low<Data> = await JSONFilePreset<Data>("src/DataBase/dbPrueba.json", defaultData);