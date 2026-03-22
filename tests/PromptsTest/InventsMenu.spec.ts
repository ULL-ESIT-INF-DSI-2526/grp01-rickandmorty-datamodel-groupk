import { beforeEach, describe, expect, test, vi } from 'vitest';

import prompts from 'prompts';
import { inventsMenu } from '../../src/Prompts/Menus/inventsMenu.js';
import type { MultiverseManager } from '../../src/Servicies/Multiverse';
import { Invents } from '../../src/Class/Invents';
import { Character } from '../../src/Class/Character';
import { Species } from '../../src/Class/Species';
import { Dimensions } from '../../src/Class/Dimensions';
import { DimensionState } from '../../src/Enums/DimensionState';

// Le dice a Vitest: cuando el codigo importe prompts, no uses la libreria real
vi.mock('prompts', () => ({
	default: vi.fn()
}));

describe('InventsMenu', () => {
	interface MenuAnswer {
		option:
		| 'list'
		| 'add'
		| 'remove'
		| 'modify'
		| 'consult by name'
		| 'consult by type'
		| 'consult by inventor'
		| 'consult by dangerlevel'
		| 'back';
	}

	interface InventFormAnswer {
		id: string;
		name: string;
		inventor: Character | null;
		type: string;
		dangerlevel: number;
		desc: string;
	}

	interface RemoveAnswer {
		id: string;
	}

	interface ConsultByNameAnswer {
		name: string;
	}

	interface ConsultByTypeAnswer {
		type: string;
	}

	interface ConsultByInventorAnswer {
		inventor: Character;
	}

	interface ConsultByDangerLevelAnswer {
		dangerlevel: number;
	}

	type PromptAnswer =
		| MenuAnswer
		| InventFormAnswer
		| RemoveAnswer
		| ConsultByNameAnswer
		| ConsultByTypeAnswer
		| ConsultByInventorAnswer
		| ConsultByDangerLevelAnswer;

	interface MockedManager {
		invents: {
			getAll: ReturnType<typeof vi.fn>;
			add: ReturnType<typeof vi.fn>;
			remove: ReturnType<typeof vi.fn>;
			modify: ReturnType<typeof vi.fn>;
			consultInventByName: ReturnType<typeof vi.fn>;
			consultInventByType: ReturnType<typeof vi.fn>;
			consultInventByInventor: ReturnType<typeof vi.fn>;
			consultInventByDangerLevel: ReturnType<typeof vi.fn>;
		};
		characters: {
			getAll: ReturnType<typeof vi.fn>;
		};
	}

	const promptsMock = vi.mocked(prompts);
	const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

	const baseDimension: Dimensions = new Dimensions('D-001', 'C-137', DimensionState.ACTIVA, 10, 'Dimension base');
	const baseSpecies: Species = new Species('S-001', 'Humano', baseDimension, 'Mamifero', 80, 'Especie base');
	const baseCharacter: Character = new Character('C-001', 'Rick Sanchez', baseSpecies, baseDimension, 'Vivo', 'Ninguna', 10, 'Genio');

	const manager: MockedManager = {
		invents: {
			getAll: vi.fn(),
			add: vi.fn(),
			remove: vi.fn(),
			modify: vi.fn(),
			consultInventByName: vi.fn(),
			consultInventByType: vi.fn(),
			consultInventByInventor: vi.fn(),
			consultInventByDangerLevel: vi.fn()
		},
		characters: {
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
		manager.invents.getAll.mockResolvedValue([]);
		manager.invents.add.mockResolvedValue(undefined);
		manager.invents.remove.mockResolvedValue(undefined);
		manager.invents.modify.mockResolvedValue(true);
		manager.invents.consultInventByName.mockResolvedValue([]);
		manager.invents.consultInventByType.mockResolvedValue([]);
		manager.invents.consultInventByInventor.mockResolvedValue([]);
		manager.invents.consultInventByDangerLevel.mockResolvedValue([]);
		manager.characters.getAll.mockResolvedValue([baseCharacter]);
	});

	test('lista inventos y vuelve al menu principal', async () => {
		const mockInvents: Invents[] = [
			new Invents('I-001', 'Pistola de portales', baseCharacter, 'Transporte', 9, 'Dispositivo de viaje')
		];
		manager.invents.getAll.mockResolvedValue(mockInvents);

		queuePrompts(
			{ option: 'list' },
			{ option: 'back' }
		);

		await inventsMenu(manager as unknown as MultiverseManager);

		expect(manager.invents.getAll).toHaveBeenCalledTimes(1);
		expect(consoleLogSpy).toHaveBeenCalledWith(mockInvents);
	});

	test('añade un invento correctamente', async () => {
		queuePrompts(
			{ option: 'add' },
			{
				id: 'I-010',
				name: 'Caja de Meeseeks',
				inventor: baseCharacter,
				type: 'Asistente',
				dangerlevel: 6,
				desc: 'Invoca ayudantes temporales'
			},
			{ option: 'back' }
		);

		await inventsMenu(manager as unknown as MultiverseManager);

		expect(manager.characters.getAll).toHaveBeenCalledTimes(1);
		expect(manager.invents.add).toHaveBeenCalledTimes(1);
		expect(manager.invents.add.mock.calls[0]?.[0]).toBeInstanceOf(Invents);
		expect(manager.invents.add.mock.calls[0]?.[0]?.id).toBe('I-010');
		expect(consoleLogSpy).toHaveBeenCalledWith('El invento I-010 ha sido añadidocorrectamente\n');
	});

	test('muestra error al fallar al añadir invento', async () => {
		manager.invents.add.mockRejectedValue(new Error('No se puede añadir ese invento'));

		queuePrompts(
			{ option: 'add' },
			{
				id: 'I-010',
				name: 'Caja de Meeseeks',
				inventor: baseCharacter,
				type: 'Asistente',
				dangerlevel: 6,
				desc: 'Invoca ayudantes temporales'
			},
			{ option: 'back' }
		);

		await inventsMenu(manager as unknown as MultiverseManager);

		expect(manager.invents.add).toHaveBeenCalledTimes(1);
		expect(consoleLogSpy).toHaveBeenCalledWith('Error', 'No se puede añadir ese invento');
	});

	test('elimina un invento por ID', async () => {
		queuePrompts(
			{ option: 'remove' },
			{ id: 'I-101' },
			{ option: 'back' }
		);

		await inventsMenu(manager as unknown as MultiverseManager);

		expect(manager.invents.remove).toHaveBeenCalledWith('I-101');
		expect(consoleLogSpy).toHaveBeenCalledWith('El invento I-101 ha sido eliminado correctamente\n');
	});

	test('modifica el invento', async () => {
		queuePrompts(
			{ option: 'modify' },
			{
				id: 'I-102',
				name: 'Pistola de portales mk2',
				inventor: baseCharacter,
				type: 'Transporte',
				dangerlevel: 10,
				desc: 'Version mejorada'
			},
			{ option: 'back' }
		);

		await inventsMenu(manager as unknown as MultiverseManager);

		expect(manager.characters.getAll).toHaveBeenCalledTimes(1);
		expect(manager.invents.modify).toHaveBeenLastCalledWith('I-102', expect.objectContaining({
			name: 'Pistola de portales mk2',
			inventor: baseCharacter,
			type: 'Transporte',
			dangerlevel: 10,
			desc: 'Version mejorada'
		}));
		expect(consoleLogSpy).toHaveBeenCalledWith('El invento I-102 ha sido modificado correctamente\n');
	});

	test('muestra error al eliminar invento', async () => {
		manager.invents.remove.mockRejectedValue(new Error('No se puede eliminar ese invento'));

		queuePrompts(
			{ option: 'remove' },
			{ id: 'I-999' },
			{ option: 'back' }
		);

		await inventsMenu(manager as unknown as MultiverseManager);

		expect(manager.invents.remove).toHaveBeenCalledWith('I-999');
		expect(consoleLogSpy).toHaveBeenCalledWith('Error', 'No se puede eliminar ese invento');
	});

	test('consulta inventos por nombre con resultados', async () => {
		const mockInvents: Invents[] = [
			new Invents('I-020', 'Caja de Meeseeks', baseCharacter, 'Asistente', 6, 'Ayuda puntual')
		];
		manager.invents.consultInventByName.mockResolvedValue(mockInvents);

		queuePrompts(
			{ option: 'consult by name' },
			{ name: 'Caja de Meeseeks' },
			{ option: 'back' }
		);

		await inventsMenu(manager as unknown as MultiverseManager);

		expect(manager.invents.consultInventByName).toHaveBeenCalledWith('Caja de Meeseeks');
		expect(consoleLogSpy).toHaveBeenCalledWith('Se encontraron 1 inventos con el nombre Caja de Meeseeks\n');
	});

	test('consulta inventos por nombre sin resultados', async () => {
		manager.invents.consultInventByName.mockResolvedValue([]);

		queuePrompts(
			{ option: 'consult by name' },
			{ name: 'Inexistente' },
			{ option: 'back' }
		);

		await inventsMenu(manager as unknown as MultiverseManager);

		expect(manager.invents.consultInventByName).toHaveBeenCalledWith('Inexistente');
		expect(consoleLogSpy).toHaveBeenCalledWith('No se encontraron resultados');
	});

	test('consulta inventos por tipo con resultados', async () => {
		const mockInvents: Invents[] = [
			new Invents('I-021', 'Pistola de portales', baseCharacter, 'Transporte', 9, 'Viajes entre dimensiones')
		];
		manager.invents.consultInventByType.mockResolvedValue(mockInvents);

		queuePrompts(
			{ option: 'consult by type' },
			{ type: 'Transporte' },
			{ option: 'back' }
		);

		await inventsMenu(manager as unknown as MultiverseManager);

		expect(manager.invents.consultInventByType).toHaveBeenCalledWith('Transporte');
		expect(consoleLogSpy).toHaveBeenCalledWith('Se encontraron 1 inventos con el nombre Transporte\n');
	});

	test('consulta inventos por inventor con resultados', async () => {
		const mockInvents: Invents[] = [
			new Invents('I-022', 'Microverso', baseCharacter, 'Energia', 8, 'Fuente de energia')
		];
		manager.invents.consultInventByInventor.mockResolvedValue(mockInvents);

		queuePrompts(
			{ option: 'consult by inventor' },
			{ inventor: baseCharacter },
			{ option: 'back' }
		);

		await inventsMenu(manager as unknown as MultiverseManager);

		expect(manager.invents.consultInventByInventor).toHaveBeenCalledWith(baseCharacter);
		expect(consoleLogSpy).toHaveBeenCalledWith(`Se encontraron 1 localizaciones en la dimensión ${baseCharacter}\n`);
	});

	test('consulta inventos por peligrosidad con resultados', async () => {
		const mockInvents: Invents[] = [
			new Invents('I-023', 'Bomba neutrino', baseCharacter, 'Arma', 10, 'Altamente peligrosa')
		];
		manager.invents.consultInventByDangerLevel.mockResolvedValue(mockInvents);

		queuePrompts(
			{ option: 'consult by dangerlevel' },
			{ dangerlevel: 10 },
			{ option: 'back' }
		);

		await inventsMenu(manager as unknown as MultiverseManager);

		expect(manager.invents.consultInventByDangerLevel).toHaveBeenCalledWith(10);
		expect(consoleLogSpy).toHaveBeenCalledWith('Se encontraron 1 localizaciones en la dimensión 10\n');
	});
});
