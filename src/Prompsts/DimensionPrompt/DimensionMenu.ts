import prompts from "prompts";


import { db } from "../../DataBase/db.js";
import { Dimensions } from "../../Class/Dimensions.js";
import { DimensionState } from "../../Enums/DimensionState.js";
import { DimensionServices } from "../../Servicies/DimensionServices.js";
import { ObjectMenuChoice, IdPromptResponse, DescPromptResponse, NamePromptResponse, 
        StatePromptResponse, DimensionMenuResponse, StateOrKeepPromptResponse,
        TechlevelTextPromptResponse, TechlevelNumberPromptResponse} from "../DimensionPrompt/DimensionType.js"
import { ObjectMenuOption } from "../../Prompsts/Mainmenu.js";
import { add, remove, mod} from "../DimensionPrompt/DimensionFunctions.js"

const dimensionService = new DimensionServices(db);

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
                await add();
                break;

            case "remove":
                await remove();
                break;

            case "mod":
                await mod();
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