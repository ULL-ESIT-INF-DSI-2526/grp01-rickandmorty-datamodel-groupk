import prompts from "prompts";

import { ObjectMenuOption } from "../Prompsts/Mainmenu.js";
import { db } from "../DataBase/db.js";
import { Dimensions } from "../Class/Dimensions.js";
import { DimensionState } from "../Enums/DimensionState.js";
import { DimensionServices } from "../Servicies/DimensionServices.js";

const dimensionService = new DimensionServices(db);

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
                await addDimension();
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

export async function addDimension(): Promise<void> {
    const idResponse = await prompts<"id">({
        type: "text",
        name: "id",
        message: "ID de la dimension:",
    });

    const nameResponse = await prompts<"name">({
        type: "text",
        name: "name",
        message: "Nombre de la dimension:",
    });

    const stateResponse = await prompts<"state">({
        type: "select",
        name: "state",
        message: "Estado de la dimension:",
        choices: [
            { title: "Activa", value: DimensionState.ACTIVA },
            { title: "Destruida", value: DimensionState.DESTRUIDA },
            { title: "Cuarentena", value: DimensionState.CUARENTENA },
        ],
    });

    const techResponse = await prompts<"techlevel">({
        type: "number",
        name: "techlevel",
        message: "Nivel tecnologico (1-10):",
        validate: (value: number) => {
            if (value < 1 || value > 10) {
                return "Debe estar entre 1 y 10";
            }
            return true;
        },
    });

    const descResponse = await prompts<"desc">({
        type: "text",
        name: "desc",
        message: "Descripcion:",
    });

    if (!idResponse.id || !nameResponse.name || !stateResponse.state || techResponse.techlevel === undefined || !descResponse.desc) {
        console.log("Operacion cancelada");
        return;
    }

    try {
        const newDimension = new Dimensions(
            idResponse.id,
            nameResponse.name,
            stateResponse.state,
            techResponse.techlevel,
            descResponse.desc,
        );

        await dimensionService.add(newDimension);
        console.log("Dimension anadida correctamente");
    } catch (error) {
        // No usar thorw new Error para que el menu siga funcionando
        if (error instanceof Error) {
            console.log(error.message);
            return;
        }
        console.log("Error al anadir dimension");
    }
}

export async function remove(): Promise<void> {
    const idResponse = await prompts<"id">({
        type: "text",
        name: "id",
        message: "ID de la dimension:",
    });

    if (!idResponse.id?.trim()) {
        console.log("Operacion cancelada");
        return;
    }

    try {
        await dimensionService.remove(idResponse.id);
        console.log("Dimension eliminada correctamente");
    } catch (error) {
        // No usar thorw new Error para que el menu siga funcionando
        if (error instanceof Error) {
            console.log(error.message);
            return;
        }
        console.log("Error al eliminar dimension");
    }
}