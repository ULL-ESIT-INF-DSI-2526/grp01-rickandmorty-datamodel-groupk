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

type IdPromptResponse = {
    id?: string;
};

type NamePromptResponse = {
    name?: string;
};

type StatePromptResponse = {
    state?: DimensionState;
};

type StateOrKeepPromptResponse = {
    state?: DimensionState | "";
};

type TechlevelNumberPromptResponse = {
    techlevel?: number;
};

type TechlevelTextPromptResponse = {
    techlevel?: string;
};

type DescPromptResponse = {
    desc?: string;
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

export async function addDimension(): Promise<void> {
    const idResponse: IdPromptResponse = await prompts<"id">({
        type: "text",
        name: "id",
        message: "ID de la dimension:",
    });

    const nameResponse: NamePromptResponse = await prompts<"name">({
        type: "text",
        name: "name",
        message: "Nombre de la dimension:",
    });

    const stateResponse: StatePromptResponse = await prompts<"state">({
        type: "select",
        name: "state",
        message: "Estado de la dimension:",
        choices: [
            { title: "Activa", value: DimensionState.ACTIVA },
            { title: "Destruida", value: DimensionState.DESTRUIDA },
            { title: "Cuarentena", value: DimensionState.CUARENTENA },
        ],
    });

    const techResponse: TechlevelNumberPromptResponse = await prompts<"techlevel">({
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

    const descResponse: DescPromptResponse = await prompts<"desc">({
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
    const idResponse: IdPromptResponse = await prompts<"id">({
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

export async function mod(): Promise<void> {
    const idResponse: IdPromptResponse = await prompts<"id">({
        type: "text",
        name: "id",
        message: "ID de la dimension a modificar:",
    });

    if (!idResponse.id?.trim()) {
        console.log("Operacion cancelada");
        return;
    }

    const nameResponse: NamePromptResponse = await prompts<"name">({
        type: "text",
        name: "name",
        message: "Nuevo nombre (Enter para mantener):",
    });

    const stateResponse: StateOrKeepPromptResponse = await prompts<"state">({
        type: "select",
        name: "state",
        message: "Nuevo estado:",
        choices: [
            { title: "Mantener", value: "" },
            { title: "Activa", value: DimensionState.ACTIVA },
            { title: "Destruida", value: DimensionState.DESTRUIDA },
            { title: "Cuarentena", value: DimensionState.CUARENTENA },
        ],
    });

    const techResponse: TechlevelTextPromptResponse = await prompts<"techlevel">({
        type: "text",
        name: "techlevel",
        message: "Nuevo nivel tecnologico (1-10, Enter para mantener):",
    });

    const descResponse: DescPromptResponse = await prompts<"desc">({
        type: "text",
        name: "desc",
        message: "Nueva descripcion (Enter para mantener):",
    });

    const modData: Partial<Dimensions> = {};

    if (nameResponse.name?.trim()) {
        modData.name = nameResponse.name.trim();
    }

    if (stateResponse.state) {
        modData.state = stateResponse.state as DimensionState;
    }

    if (techResponse.techlevel?.trim()) {
        const parsedTechlevel = Number(techResponse.techlevel);
            if (parsedTechlevel < 1 || parsedTechlevel > 10) {
                console.log("Debe estar entre 1 y 10");
                return;
            }
        modData.techlevel = parsedTechlevel;
    }

    if (descResponse.desc?.trim()) {
        modData.desc = descResponse.desc.trim();
    }

    if (Object.keys(modData).length === 0) {
        console.log("No hay cambios para aplicar");
        return;
    }

    try {
        const modified = await dimensionService.modify(idResponse.id.trim(), modData);

        if (!modified) {
            console.log("No existe una dimension con ese ID");
            return;
        }

        console.log("Dimension modificada correctamente");
    } catch (error) {
        // No usar thorw new Error para que el menu siga funcionando
        if (error instanceof Error) {
            console.log(error.message);
            return;
        }
        console.log("Error al modificar dimension");
    }
}