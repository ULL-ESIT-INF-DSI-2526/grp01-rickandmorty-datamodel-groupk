import prompts from "prompts";

import { Character } from "./Class/Character.js";
import { Dimensions } from "./Class/Dimensions.js";
import { Invents } from "./Class/Invents.js";
import { Planets } from "./Class/Planets.js";
import { Species } from "./Class/Species.js";
import { db } from "./DataBase/db.js";
import { DimensionState } from "./Enums/DimensionState.js";
import { CharacterServices } from "./Servicies/CharacterServicies.js";
import { DimensionServices } from "./Servicies/DimensionServices.js";
import { InventServices } from "./Servicies/InventServices.js";
import { LocationServices } from "./Servicies/LocationServicies.js";
import { SpeciesServices } from "./Servicies/SpeciesServices.js";

const dimensionService = new DimensionServices(db);
const locationService = new LocationServices(db);
const speciesService = new SpeciesServices(db);
const characterService = new CharacterServices(db);
const inventService = new InventServices(db);

async function mainMenu() {
  const response = await prompts({
    type: "select",
    name: "option",
    message: "¿Qué quieres hacer?",
    choices: [
      { title: "Gestionar Dimensiones", value: "dimensions" },
      { title: "Gestionar Personajes", value: "characters" },
      { title: "Gestionar Especies", value: "species" },
      { title: "Gestionar Localizaciones", value: "locations" },
      { title: "Gestionar Inventos", value: "invents" },
      { title: "Salir", value: "exit" },
    ],
  });

  return response.option;
}
