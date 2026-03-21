import prompts from "prompts";

import { Character } from "../Class/Character.js";
import { Dimensions } from "../Class/Dimensions.js";
import { Invents } from "../Class/Invents.js";
import { Planets } from "../Class/Planets.js";
import { Species } from "../Class/Species.js";
import { db } from "../DataBase/db.js";
import { DimensionState } from "../Enums/DimensionState.js";
import { CharacterServices } from "../Servicies/CharacterServicies.js";
import { DimensionServices } from "../Servicies/DimensionServices.js";
import { InventServices } from "../Servicies/InventServices.js";
import { LocationServices } from "../Servicies/LocationServicies.js";
import { SpeciesServices } from "../Servicies/SpeciesServices.js";
import {startDimension} from "../Prompsts/Dimensionmenu.js";

const dimensionService = new DimensionServices(db);
const locationService = new LocationServices(db);
const speciesService = new SpeciesServices(db);
const characterService = new CharacterServices(db);
const inventService = new InventServices(db);

export type MainMenuOption = "dimensions" | "characters" | "species" | "locations" | "invents" | "consultar" | "exit";

export type ObjectMenuOption = "add" | "remove" | "mod" | "list" | "back";

type MainMenuChoice = {
    title: string;
    value: MainMenuOption;
};

type MainMenuPromptResponse = {
    option?: MainMenuOption;
};

export async function mainMenu(): Promise<MainMenuOption> {
    const choices: MainMenuChoice[] = [
        { title: "Gestionar Dimensiones", value: "dimensions"},
        { title: "Gestionar Personajes", value: "characters"},
        { title: "Gestionar Especies", value: "species"},
        { title: "Gestionar Localizaciones", value: "locations"},
        { title: "Gestionar Inventos", value: "invents"},
        { title: "Consultar", value: "consultar"},
        { title: "Salir", value: "exit"},
    ];

    const response: MainMenuPromptResponse = await prompts<"option">({
        type: "select",
        name: "option",
        message: "¿Qué quieres hacer?",
        choices,
    });

    return response.option ?? "exit";
}

export async function startInterface(): Promise<void> {
    let exit: boolean = false;

    while (!exit) {
        const option: MainMenuOption = await mainMenu();
        switch (option) {
            case "dimensions":
                await startDimension();
                break;

            case "characters":
                break;

            case "species":
                break;

            case "locations":
                break;

            case "invents":
                break;

            case "exit":
                exit = true;
                break;
        }
    }

    console.log("Salir");
}
