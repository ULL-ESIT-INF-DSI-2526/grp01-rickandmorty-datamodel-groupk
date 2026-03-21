import prompts from "prompts";

import { DimensionState } from "../../Enums/DimensionState.js";
import { ObjectMenuOption } from "../Mainmenu.js";
import {
	DescPromptResponse,
	DimensionMenuResponse,
	IdPromptResponse,
	NamePromptResponse,
	ObjectMenuChoice,
	StateOrKeepPromptResponse,
	StatePromptResponse,
	TechlevelNumberPromptResponse,
	TechlevelTextPromptResponse,
} from "./DimensionType.js";

export async function askDimensionMenuAction(): Promise<DimensionMenuResponse> {
	const choices: ObjectMenuChoice[] = [
		{ title: "Anadir dimension", value: "add" },
		{ title: "Eliminar dimension", value: "remove" },
		{ title: "Modificar dimension", value: "mod" },
		{ title: "Listar dimensiones", value: "list" },
		{ title: "Volver", value: "back" },
	];

	return prompts<"action">({
		type: "select",
		name: "action",
		message: "Gestion de dimensiones",
		choices,
	}) as Promise<DimensionMenuResponse>;
}

export async function askDimensionId(message: string = "ID de la dimension:"): Promise<IdPromptResponse> {
	return prompts<"id">({
		type: "text",
		name: "id",
		message,
	}) as Promise<IdPromptResponse>;
}

export async function askDimensionName(message: string = "Nombre de la dimension:"): Promise<NamePromptResponse> {
	return prompts<"name">({
		type: "text",
		name: "name",
		message,
	}) as Promise<NamePromptResponse>;
}

export async function askDimensionState(message: string = "Estado de la dimension:"): Promise<StatePromptResponse> {
	return prompts<"state">({
		type: "select",
		name: "state",
		message,
		choices: [
			{ title: "Activa", value: DimensionState.ACTIVA },
			{ title: "Destruida", value: DimensionState.DESTRUIDA },
			{ title: "Cuarentena", value: DimensionState.CUARENTENA },
		],
	}) as Promise<StatePromptResponse>;
}

export async function askDimensionStateOrKeep(): Promise<StateOrKeepPromptResponse> {
	return prompts<"state">({
		type: "select",
		name: "state",
		message: "Nuevo estado:",
		choices: [
			{ title: "Mantener", value: "" },
			{ title: "Activa", value: DimensionState.ACTIVA },
			{ title: "Destruida", value: DimensionState.DESTRUIDA },
			{ title: "Cuarentena", value: DimensionState.CUARENTENA },
		],
	}) as Promise<StateOrKeepPromptResponse>;
}

export async function askDimensionTechlevel(): Promise<TechlevelNumberPromptResponse> {
	return prompts<"techlevel">({
		type: "number",
		name: "techlevel",
		message: "Nivel tecnologico (1-10):",
		validate: (value: number) => {
			if (value < 1 || value > 10) {
				return "Debe estar entre 1 y 10";
			}
			return true;
		},
	}) as Promise<TechlevelNumberPromptResponse>;
}

export async function askDimensionTechlevelOrKeep(): Promise<TechlevelTextPromptResponse> {
	return prompts<"techlevel">({
		type: "text",
		name: "techlevel",
		message: "Nuevo nivel tecnologico (1-10, Enter para mantener):",
	}) as Promise<TechlevelTextPromptResponse>;
}

export async function askDimensionDescription(message: string = "Descripcion:"): Promise<DescPromptResponse> {
	return prompts<"desc">({
		type: "text",
		name: "desc",
		message,
	}) as Promise<DescPromptResponse>;
}

export function getDimensionMenuAction(response: DimensionMenuResponse): ObjectMenuOption {
	return response.action ?? "back";
}
