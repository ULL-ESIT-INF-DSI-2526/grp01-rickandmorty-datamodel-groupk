import { beforeEach, describe, expect, test, vi } from 'vitest';

import prompts from 'prompts';
import { dimensionsMenu } from '../../src/Prompts/Menus/DimensionsMenu.js';
import type { MultiverseManager } from '../../src/Servicies/Multiverse';
import { Dimensions } from '../../src/Class/Dimensions';
import { DimensionState } from '../../src/Enums/DimensionState';

// Le dice a Vitest: cuando el código importe prompts, no uses la librería real
vi.mock('prompts', () => ({
	default: vi.fn()
}));


describe('DimensionMenu', () => {
	interface MenuAnswer {
		option:
		'list'
		| 'add'
		| 'remove'
		| 'modify'
        | 'back';
	}

	interface DimensionFormAnswer {
		id: string;
		name: string;
		state: DimensionState;
		techlevel: number;
		desc: string;
	}

	interface RemoveAnswer {
		id: string;
	}

	type PromptAnswer = MenuAnswer | DimensionFormAnswer | RemoveAnswer;

	interface MockedManager {
		dimensions: {
			getAll: ReturnType<typeof vi.fn>;
			add: ReturnType<typeof vi.fn>;
			remove: ReturnType<typeof vi.fn>;
			modify: ReturnType<typeof vi.fn>;
		}
	}

		const promptsMock = vi.mocked(prompts);
		const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

	const manager: MockedManager = {
		dimensions: {
			getAll: vi.fn(),
			add: vi.fn(),
			remove: vi.fn(),
			modify: vi.fn()
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
		manager.dimensions.getAll.mockResolvedValue([]);
		manager.dimensions.add.mockResolvedValue(undefined);
		manager.dimensions.remove.mockResolvedValue(undefined);
		manager.dimensions.modify.mockResolvedValue(true);
	});

    test('lista de dimensiones y vuelve al menú principal', async () => {
        const mockDimension: Dimensions[] = [
            new Dimensions('D-001', 'C-137', DimensionState.ACTIVA, 10, 'Dimensión base')
        ];
        manager.dimensions.getAll.mockResolvedValue(mockDimension);

        queuePrompts(
			{ option: 'list' },
			{ option: 'back' }
		);

        await dimensionsMenu(manager as unknown as MultiverseManager);

        // Comprueba que se ha llamado solo una vez
        expect(manager.dimensions.getAll).toHaveBeenCalledTimes(1);
        // Comprueba que se hizo un console.log
        expect(consoleLogSpy).toHaveBeenCalledWith(mockDimension);
    });

    test('añade una dimensión correctamente', async () => {
        queuePrompts(
            { option: 'add'},
            {
                id: "C-137",
                name: "Dimensión Principal",
                state: DimensionState.ACTIVA,
                techlevel: 9,
                desc: "Origen de Rick"
            },
            { option: 'back' }
        );

        await dimensionsMenu(manager as unknown as MultiverseManager);

        expect(manager.dimensions.add).toHaveBeenCalledTimes(1);
        expect(manager.dimensions.add.mock.calls[0]?.[0]).toBeInstanceOf(Dimensions);
        expect(manager.dimensions.add.mock.calls[0]?.[0]?.id).toBe('C-137');
        expect(consoleLogSpy).toHaveBeenCalledWith("La dimensión C-137 ha sido añadida correctamente");
    });

    test('muestra error al fallar al añadir dimensión', async () => {
        manager.dimensions.add.mockRejectedValue(new Error('No se puede añadir esa dimensión'));
        
        queuePrompts(
            { option: 'add'},
            {
                id: "C-137",
                name: "Dimensión Principal",
                state: DimensionState.ACTIVA,
                techlevel: 9,
                desc: "Origen de Rick"
            },
            { option: 'back' }
        );

        await dimensionsMenu(manager as unknown as MultiverseManager);

        expect(manager.dimensions.add).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith('Error', 'No se puede añadir esa dimensión');
    });

    test('elimina una dimensión por ID', async () => {
        queuePrompts(
            {option: 'remove' },
            {id: 'D-101' },
            { option: 'back' }
        );

        await dimensionsMenu(manager as unknown as MultiverseManager);
        expect(manager.dimensions.remove).toHaveBeenCalledWith('D-101');
        expect(consoleLogSpy).toHaveBeenCalledWith("La dimensión D-101 ha sido eliminada correctamente");
    });

    test('modifica la dimensión', async () => {
        queuePrompts(
            { option: 'modify' },
            {
                id: 'C-137',
                name: 'Dimensión Principal',
                state: DimensionState.DESTRUIDA,
                techlevel: 9,
                desc: 'Antiguo Origen de Rick'
            },
            { option: 'back' }
        );

        await dimensionsMenu(manager as unknown as MultiverseManager);

        expect(manager.dimensions.modify).toHaveBeenLastCalledWith('C-137', expect.objectContaining({
            name: 'Dimensión Principal',
            state: DimensionState.DESTRUIDA,
            desc: 'Antiguo Origen de Rick'
        }));
         expect(consoleLogSpy).toHaveBeenCalledWith("La dimensión C-137 ha sido modificada correctamente");
    });
        

})