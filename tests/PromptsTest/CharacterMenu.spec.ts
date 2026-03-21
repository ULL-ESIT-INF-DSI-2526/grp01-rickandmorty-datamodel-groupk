import { beforeEach, describe, expect, test, vi } from 'vitest';

import prompts from 'prompts';

import { charactersMenu } from '../../src/Prompts/Menus/CharactersMenu';
import type { MultiverseManager } from '../../src/Servicies/Multiverse';
import { Character } from '../../src/Class/Character';
import { Dimensions } from '../../src/Class/Dimensions';
import { Species } from '../../src/Class/Species';
import { DimensionState } from '../../src/Enums/DimensionState';

// Le dice a Vitest: cuando el código importe prompts, no uses la librería real
vi.mock('prompts', () => ({
	default: vi.fn()
}));

describe('CharactersMenu', () => {
	interface MenuAnswer {
		option:
		  'list'
			| 'add'
			| 'remove'
			| 'modify'
			| 'consult by name'
			| 'consult by afiliation'
			| 'consult by specie'
			| 'consult by state'
			| 'consult by dimension'
			| 'fins alternative versions'
			| 'sort by iq'
			| 'sort by name'
			| 'back';
	}

	interface CharacterFormAnswer {
		id: string;
		name: string;
		specie: Species | null;
		dimension: Dimensions | null;
		state: string;
		afiliation: string;
		iq: number;
		desc: string;
	}

	interface RemoveAnswer {
		id: string;
	}

	interface ConsultByNameAnswer {
		name: string;
	}

	type PromptAnswer = MenuAnswer | CharacterFormAnswer | RemoveAnswer | ConsultByNameAnswer;

	interface MockedManager {
		characters: {
			getAll: ReturnType<typeof vi.fn>;
			add: ReturnType<typeof vi.fn>;
			remove: ReturnType<typeof vi.fn>;
			modify: ReturnType<typeof vi.fn>;
			consultCharacterByName: ReturnType<typeof vi.fn>;
		};
		dimensions: {
			getAll: ReturnType<typeof vi.fn>;
		};
		species: {
			getAll: ReturnType<typeof vi.fn>;
		};
	}

	const promptsMock = vi.mocked(prompts);
	const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

	const baseDimension: Dimensions = new Dimensions('D-001', 'C-137', DimensionState.ACTIVA, 10, 'Dimensión base');
	const baseSpecies: Species = new Species('S-001', 'Humano', baseDimension, 'Mamífero', 80, 'Bípedo');

	const manager: MockedManager = {
		characters: {
			getAll: vi.fn(),
			add: vi.fn(),
			remove: vi.fn(),
			modify: vi.fn(),
			consultCharacterByName: vi.fn()
		},
		dimensions: {
			getAll: vi.fn()
		},
		species: {
			getAll: vi.fn()
		}
	};

	function queuePrompts(...answers: PromptAnswer[]): void {
		promptsMock.mockImplementation(async () => {
			const nextAnswer: PromptAnswer | undefined = answers.shift();
			if (nextAnswer === undefined) {
				throw new Error('No hay más respuestas mockeadas para prompts');
			}
			return nextAnswer;
		});
	}

	beforeEach(() => {
		vi.clearAllMocks();
		manager.characters.getAll.mockResolvedValue([]);
		manager.characters.add.mockResolvedValue(undefined);
		manager.characters.remove.mockResolvedValue(undefined);
		manager.characters.modify.mockResolvedValue(true);
		manager.characters.consultCharacterByName.mockResolvedValue([]);
		manager.dimensions.getAll.mockResolvedValue([baseDimension]);
		manager.species.getAll.mockResolvedValue([baseSpecies]);
	});

	test('lista personajes y vuelve al menú principal', async () => {
		const mockCharacters: Character[] = [
			new Character('C-001', 'Rick Sanchez', baseSpecies, baseDimension, 'Vivo', 'Ninguna', 10, 'Genio')
		];
		manager.characters.getAll.mockResolvedValue(mockCharacters);

		queuePrompts(
			{ option: 'list' },
			{ option: 'back' }
		);

		await charactersMenu(manager as unknown as MultiverseManager);

        // Comprueba que se ha llamado solo una vez
		expect(manager.characters.getAll).toHaveBeenCalledTimes(1); 
        // Comprueba que se hizo un console.log
		expect(consoleLogSpy).toHaveBeenCalledWith(mockCharacters);
	});

	test('añade un personaje correctamente', async () => {
		queuePrompts(
			{ option: 'add' },
			{
				id: 'C-010',
				name: 'Evil Morty',
				specie: baseSpecies,
				dimension: baseDimension,
				state: 'Vivo',
				afiliation: 'Ciudadela',
				iq: 9,
				desc: 'Presidente de la Ciudadela'
			},
			{ option: 'back' }
		);

		await charactersMenu(manager as unknown as MultiverseManager);

		expect(manager.dimensions.getAll).toHaveBeenCalledTimes(1);
		expect(manager.species.getAll).toHaveBeenCalledTimes(1);
		expect(manager.characters.add).toHaveBeenCalledTimes(1);
		expect(manager.characters.add.mock.calls[0]?.[0]).toBeInstanceOf(Character);
		expect(manager.characters.add.mock.calls[0]?.[0]?.id).toBe('C-010');
		expect(consoleLogSpy).toHaveBeenCalledWith('El personaje C-010 ha sido añadido correctamente\n');
	});

	test('muestra error al fallar el alta de personaje', async () => {
		manager.characters.add.mockRejectedValue(new Error('No se puede añadir ese personaje porque ya existe'));

		queuePrompts(
			{ option: 'add' },
			{
				id: 'C-001',
				name: 'Rick Sanchez',
				specie: baseSpecies,
				dimension: baseDimension,
				state: 'Vivo',
				afiliation: 'Ninguna',
				iq: 10,
				desc: 'Genio'
			},
			{ option: 'back' }
		);

		await charactersMenu(manager as unknown as MultiverseManager);

		expect(manager.characters.add).toHaveBeenCalledTimes(1);
		expect(consoleLogSpy).toHaveBeenCalledWith('Error', 'No se puede añadir ese personaje porque ya existe');
	});

	test('elimina personaje por ID', async () => {
		queuePrompts(
			{ option: 'remove' },
			{ id: 'C-003' },
			{ option: 'back' }
		);

		await charactersMenu(manager as unknown as MultiverseManager);

		expect(manager.characters.remove).toHaveBeenCalledWith('C-003');
		expect(consoleLogSpy).toHaveBeenCalledWith('El personaje C-003 ha sido eliminado correctamente\n');
	});

	test('modifica un personaje', async () => {
		queuePrompts(
			{ option: 'modify' },
			{
				id: 'C-002',
				name: 'Morty Malvado',
				specie: null,
				dimension: baseDimension,
				state: 'Desconocido',
				afiliation: '',
				iq: 8,
				desc: 'Versión alternativa'
			},
			{ option: 'back' }
		);

		await charactersMenu(manager as unknown as MultiverseManager);

		expect(manager.characters.modify).toHaveBeenCalledWith('C-002', {
			name: 'Morty Malvado',
			dimension: baseDimension,
			state: 'Desconocido',
			iq: 8,
			desc: 'Versión alternativa'
		});
		expect(consoleLogSpy).toHaveBeenCalledWith('El personaje C-002 ha sido modificado correctamente\n');
	});

	test('consult by name vuelve al menú y permite salir con back', async () => {
		queuePrompts(
			{ option: 'consult by name' },
			{ name: 'Rick Sanchez' },
			{ option: 'back' }
		);

		await charactersMenu(manager as unknown as MultiverseManager);

		expect(manager.characters.getAll).not.toHaveBeenCalled();
		expect(manager.characters.add).not.toHaveBeenCalled();
		expect(manager.characters.remove).not.toHaveBeenCalled();
		expect(manager.characters.modify).not.toHaveBeenCalled();
	});
});
