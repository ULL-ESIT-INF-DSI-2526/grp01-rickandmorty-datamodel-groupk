import { beforeEach, describe, expect, test, vi } from 'vitest';

import prompts from 'prompts';
import { speciesMenu } from '../../src/Prompts/Menus/SpeciesMenu.js';
import type { MultiverseManager } from '../../src/Servicies/Multiverse';
import { Species } from '../../src/Class/Species';
import { Dimensions } from '../../src/Class/Dimensions';
import { Planets } from '../../src/Class/Planets';
import { DimensionState } from '../../src/Enums/DimensionState';

// Le dice a Vitest: cuando el codigo importe prompts, no uses la libreria real
vi.mock('prompts', () => ({
	default: vi.fn()
}));

describe('SpeciesMenu', () => {
	interface MenuAnswer {
		option:
		| 'list'
		| 'add'
		| 'remove'
		| 'modify'
		| 'back';
	}

	interface SpeciesFormAnswer {
		id: string;
		name: string;
		origin: Dimensions | null;
		type: string;
		expectancy: number;
		desc: string;
	}

	interface RemoveAnswer {
		id: string;
	}

	type PromptAnswer = MenuAnswer | SpeciesFormAnswer | RemoveAnswer;

	interface MockedManager {
		species: {
			getAll: ReturnType<typeof vi.fn>;
			add: ReturnType<typeof vi.fn>;
			remove: ReturnType<typeof vi.fn>;
			modify: ReturnType<typeof vi.fn>;
		};
		dimensions: {
			getAll: ReturnType<typeof vi.fn>;
		};
		localitations: {
			getAll: ReturnType<typeof vi.fn>;
		};
	}

	const promptsMock = vi.mocked(prompts);
	const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

	const baseDimension: Dimensions = new Dimensions('D-001', 'C-137', DimensionState.ACTIVA, 10, 'Dimension base');
	const baseLocation: Planets = new Planets('L-001', 'Tierra', 'Planeta', baseDimension, 1000, 'Planeta base');

	const manager: MockedManager = {
		species: {
			getAll: vi.fn(),
			add: vi.fn(),
			remove: vi.fn(),
			modify: vi.fn()
		},
		dimensions: {
			getAll: vi.fn()
		},
		localitations: {
			getAll: vi.fn()
		}
	};

	function queuePrompts(...answers: PromptAnswer[]): void {
		promptsMock.mockImplementation(async () => {
			const nextAnswer: PromptAnswer | undefined = answers.shift();
			if (nextAnswer === undefined) {
				throw new Error('No hay mas respuestas mockeadas para prompts');
			}
			return nextAnswer;
		});
	}

	beforeEach(() => {
		vi.clearAllMocks();
		manager.species.getAll.mockResolvedValue([]);
		manager.species.add.mockResolvedValue(undefined);
		manager.species.remove.mockResolvedValue(undefined);
		manager.species.modify.mockResolvedValue(true);
		manager.dimensions.getAll.mockResolvedValue([baseDimension]);
		manager.localitations.getAll.mockResolvedValue([baseLocation]);
	});

	test('lista especies y vuelve al menu principal', async () => {
		const mockSpecies: Species[] = [
			new Species('S-001', 'Humano', baseDimension, 'Mamifero', 80, 'Especie base')
		];
		manager.species.getAll.mockResolvedValue(mockSpecies);

		queuePrompts(
			{ option: 'list' },
			{ option: 'back' }
		);

		await speciesMenu(manager as unknown as MultiverseManager);

		expect(manager.species.getAll).toHaveBeenCalledTimes(1);
		expect(consoleLogSpy).toHaveBeenCalledWith(mockSpecies);
	});

	test('añade una especie correctamente', async () => {
		queuePrompts(
			{ option: 'add' },
			{
				id: 'S-100',
				name: 'Cronenberg',
				origin: baseDimension,
				type: 'Mutante',
				expectancy: 40,
				desc: 'Especie alterada'
			},
			{ option: 'back' }
		);

		await speciesMenu(manager as unknown as MultiverseManager);

		expect(manager.dimensions.getAll).toHaveBeenCalledTimes(1);
		expect(manager.localitations.getAll).toHaveBeenCalledTimes(1);
		expect(manager.species.add).toHaveBeenCalledTimes(1);
		expect(manager.species.add.mock.calls[0]?.[0]).toBeInstanceOf(Species);
		expect(manager.species.add.mock.calls[0]?.[0]?.id).toBe('S-100');
		expect(consoleLogSpy).toHaveBeenCalledWith('La especie S-100 ha sido añadida correctamente');
	});

	test('muestra error al fallar al añadir especie', async () => {
		manager.species.add.mockRejectedValue(new Error('No se puede añadir esa especie'));

		queuePrompts(
			{ option: 'add' },
			{
				id: 'S-100',
				name: 'Cronenberg',
				origin: baseDimension,
				type: 'Mutante',
				expectancy: 40,
				desc: 'Especie alterada'
			},
			{ option: 'back' }
		);

		await speciesMenu(manager as unknown as MultiverseManager);

		expect(manager.species.add).toHaveBeenCalledTimes(1);
		expect(consoleLogSpy).toHaveBeenCalledWith('Error', 'No se puede añadir esa especie');
	});

	test('elimina una especie por ID', async () => {
		queuePrompts(
			{ option: 'remove' },
			{ id: 'S-101' },
			{ option: 'back' }
		);

		await speciesMenu(manager as unknown as MultiverseManager);

		expect(manager.species.remove).toHaveBeenCalledWith('S-101');
		expect(consoleLogSpy).toHaveBeenCalledWith('La especie S-101 ha sido eliminada correctamente');
	});

	test('modifica la especie', async () => {
		queuePrompts(
			{ option: 'modify' },
			{
				id: 'S-102',
				name: 'Humano Mejorado',
				origin: baseDimension,
				type: 'Bioingenieria',
				expectancy: 120,
				desc: 'Version modificada'
			},
			{ option: 'back' }
		);

		await speciesMenu(manager as unknown as MultiverseManager);

		expect(manager.dimensions.getAll).toHaveBeenCalledTimes(1);
		expect(manager.localitations.getAll).toHaveBeenCalledTimes(1);
		expect(manager.species.modify).toHaveBeenLastCalledWith('S-102', expect.objectContaining({
			name: 'Humano Mejorado',
			origin: baseDimension,
			type: 'Bioingenieria',
			expectancy: 120,
			desc: 'Version modificada'
		}));
		expect(consoleLogSpy).toHaveBeenCalledWith('La especie S-102 ha sido modificada correctamente');
	});

	test('muestra error al eliminar especie', async () => {
		manager.species.remove.mockRejectedValue(new Error('No se puede eliminar esa especie'));

		queuePrompts(
			{ option: 'remove' },
			{ id: 'S-999' },
			{ option: 'back' }
		);

		await speciesMenu(manager as unknown as MultiverseManager);

		expect(manager.species.remove).toHaveBeenCalledWith('S-999');
		expect(consoleLogSpy).toHaveBeenCalledWith('Error', 'No se puede eliminar esa especie');
	});
});
