import prompts from "prompts";

import { ObjectMenuOption } from "../Prompsts/Mainmenu.js";
import { Dimensions } from "../Class/Dimensions.js";
import { DimensionState } from "../Enums/DimensionState.js";
import { DimensionServices } from "../Servicies/DimensionServices.js";

type ObjectMenuChoice = {
    title: string;
    value: ObjectMenuOption;
};

type DimensionMenuResponse = {
    action?: ObjectMenuOption;
};

export async function dimensionsMenu(): Promise<ObjectMenuOption> {
    const choices: ObjectMenuChoice[] = [
        { title: "Anadir dimension", value: "add" },
        { title: "Eliminar dimension", value: "remove" },
        { title: "Modificar dimension", value: "mod" },
        { title: "Listar dimensiones", value: "list" },
        { title: "Volver", value: "back" },
    ];

    const response: DimensionMenuResponse = await prompts<"action">({
    type: "select",
    name: "action",
    message: "Gestión de dimensiones",
        choices,
  });

    return response.action ?? "back";
}

export async function startDimension(): Promise<void> {
    let exit: boolean = false;

    while (!exit) {
        const option: ObjectMenuOption = await dimensionsMenu();
        switch (option) {
            case "add":
                break;

            case "remove":
                break;

            case "mod":
                break;

            case "list":
                break;

            case "back":
                exit = true;
                break;
        }
    }

    console.log("Salir");
}

export async function addDimension() {
  
}