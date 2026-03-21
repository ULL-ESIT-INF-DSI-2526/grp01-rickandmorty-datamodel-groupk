import { db } from "../../DataBase/db.js";
import { Dimensions } from "../../Class/Dimensions.js";
import { DimensionState } from "../../Enums/DimensionState.js";
import { DimensionServices } from "../../Servicies/DimensionServices.js";
import {
	askDimensionDescription,
	askDimensionId,
	askDimensionName,
	askDimensionState,
	askDimensionStateOrKeep,
	askDimensionTechlevel,
	askDimensionTechlevelOrKeep,
} from "./DimensionQuest.js";

const dimensionService = new DimensionServices(db);

export async function add(): Promise<void> {
	const idResponse = await askDimensionId();
	const nameResponse = await askDimensionName();
	const stateResponse = await askDimensionState();
	const techResponse = await askDimensionTechlevel();
	const descResponse = await askDimensionDescription();

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
		if (error instanceof Error) {
			console.log(error.message);
			return;
		}
		console.log("Error al anadir dimension");
	}
}

export async function remove(): Promise<void> {
	const idResponse = await askDimensionId();

	if (!idResponse.id?.trim()) {
		console.log("Operacion cancelada");
		return;
	}

	try {
		await dimensionService.remove(idResponse.id);
		console.log("Dimension eliminada correctamente");
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message);
			return;
		}
		console.log("Error al eliminar dimension");
	}
}

export async function mod(): Promise<void> {
	const idResponse = await askDimensionId("ID de la dimension a modificar:");

	if (!idResponse.id?.trim()) {
		console.log("Operacion cancelada");
		return;
	}

	const nameResponse = await askDimensionName("Nuevo nombre (Enter para mantener):");
	const stateResponse = await askDimensionStateOrKeep();
	const techResponse = await askDimensionTechlevelOrKeep();
	const descResponse = await askDimensionDescription("Nueva descripcion (Enter para mantener):");

    // Mirar esto
	const modData: Partial<Dimensions> = {};

	if (nameResponse.name?.trim()) {
		modData.name = nameResponse.name.trim();
	}

	if (stateResponse.state) {
		modData.state = stateResponse.state as DimensionState;
	}

	if (techResponse.techlevel?.trim()) {
		const parsedTechlevel = Number(techResponse.techlevel);
		if (parsedTechlevel < 1 || parsedTechlevel > 10 || !Number.isInteger(parsedTechlevel)) {
			console.log("Debe estar entre 1 y 10 y ser entero");
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
		if (error instanceof Error) {
			console.log(error.message);
			return;
		}
		console.log("Error al modificar dimension");
	}
}

export async function list(): Promise<void> {
	try {
		const dimensions = await dimensionService.getAll();

		if (dimensions.length === 0) {
			console.log("No hay dimensiones registradas");
			return;
		}

		console.table(
			dimensions.map((dimension) => {
				const record = dimension as unknown as {
					id?: string;
					name?: string;
					state?: string;
					techlevel?: number;
					desc?: string;
					_id?: string;
					_name?: string;
					_state?: string;
					_techlevel?: number;
					_desc?: string;
				};

				return {
					id: record.id ?? record._id,
					name: record.name ?? record._name,
					state: record.state ?? record._state,
					techlevel: record.techlevel ?? record._techlevel,
					desc: record.desc ?? record._desc,
				};
			}),
		);
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message);
			return;
		}
		console.log("Error al listar dimensiones");
	}
}
