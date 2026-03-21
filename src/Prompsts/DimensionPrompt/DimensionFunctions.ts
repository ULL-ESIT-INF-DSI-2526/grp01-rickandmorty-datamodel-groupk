import { Dimensions } from "../../Class/Dimensions.js";
import { DimensionState } from "../../Enums/DimensionState.js";
import {
	DimensionPatch,
	IDimensionPrompts,
	IDimensionService,
	ITextOutput,
} from "./DimensionType.js";

export type DimensionUseCases = {
	add(): Promise<void>;
	remove(): Promise<void>;
	mod(): Promise<void>;
};

export function createDimensionUseCases(
	service: IDimensionService,
	prompts: IDimensionPrompts,
	output: ITextOutput,
): DimensionUseCases {
	const add = async (): Promise<void> => {
		const idResponse = await prompts.askDimensionId();
		const nameResponse = await prompts.askDimensionName();
		const stateResponse = await prompts.askDimensionState();
		const techResponse = await prompts.askDimensionTechlevel();
		const descResponse = await prompts.askDimensionDescription();

		if (!idResponse.id || !nameResponse.name || !stateResponse.state || techResponse.techlevel === undefined || !descResponse.desc) {
			output.info("Operacion cancelada");
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

			await service.add(newDimension);
			output.info("Dimension anadida correctamente");
		} catch (error) {
			if (error instanceof Error) {
				output.error(error.message);
				return;
			}
			output.error("Error al anadir dimension");
		}
	};

	const remove = async (): Promise<void> => {
		const idResponse = await prompts.askDimensionId();

		if (!idResponse.id?.trim()) {
			output.info("Operacion cancelada");
			return;
		}

		try {
			await service.remove(idResponse.id);
			output.info("Dimension eliminada correctamente");
		} catch (error) {
			if (error instanceof Error) {
				output.error(error.message);
				return;
			}
			output.error("Error al eliminar dimension");
		}
	};

	const mod = async (): Promise<void> => {
		const idResponse = await prompts.askDimensionId("ID de la dimension a modificar:");

		if (!idResponse.id?.trim()) {
			output.info("Operacion cancelada");
			return;
		}

		const nameResponse = await prompts.askDimensionName("Nuevo nombre (Enter para mantener):");
		const stateResponse = await prompts.askDimensionStateOrKeep();
		const techResponse = await prompts.askDimensionTechlevelOrKeep();
		const descResponse = await prompts.askDimensionDescription("Nueva descripcion (Enter para mantener):");

		const modData: DimensionPatch = {};

		if (nameResponse.name?.trim()) {
			modData.name = nameResponse.name.trim();
		}

		if (stateResponse.state) {
			modData.state = stateResponse.state as DimensionState;
		}

		if (techResponse.techlevel?.trim()) {
			const parsedTechlevel = Number(techResponse.techlevel);
			if (parsedTechlevel < 1 || parsedTechlevel > 10 || !Number.isInteger(parsedTechlevel)) {
				output.error("Debe estar entre 1 y 10 y ser entero");
				return;
			}
			modData.techlevel = parsedTechlevel;
		}

		if (descResponse.desc?.trim()) {
			modData.desc = descResponse.desc.trim();
		}

		if (Object.keys(modData).length === 0) {
			output.info("No hay cambios para aplicar");
			return;
		}

		try {
			const modified = await service.modify(idResponse.id.trim(), modData);

			if (!modified) {
				output.info("No existe una dimension con ese ID");
				return;
			}

			output.info("Dimension modificada correctamente");
		} catch (error) {
			if (error instanceof Error) {
				output.error(error.message);
				return;
			}
			output.error("Error al modificar dimension");
		}
	};

	return { add, remove, mod };
}
