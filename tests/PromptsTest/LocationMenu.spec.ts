import { beforeEach, describe, expect, test, vi } from 'vitest';

import prompts from 'prompts';
import { localitationMenu } from '../../src/Prompts/Menus/LocalitationMenu.js';
import type { MultiverseManager } from '../../src/Servicies/Multiverse';
import { Planets } from '../../src/Class/Planets';
import { Dimensions } from '../../src/Class/Dimensions';
import { DimensionState } from '../../src/Enums/DimensionState';

// Le dice a Vitest: cuando el código importe prompts, no uses la librería real
vi.mock('prompts', () => ({
	default: vi.fn()
}));

describe('LocationMenu', () => {
    interface MenuAnswer {
        option:
            'list'
            | 'add'
            | 'remove'
            | 'modify'
            | 'back'
            | 'consult by name'
            | 'consult by type'
            | 'consult by dimension';
    }

    interface LocationFormAnswer {
        id: string;
        name: string;
        type: string;
        dimension: Dimensions | null;
        population: number | null;
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

    interface ConsultByDimensionAnswer {
        dimension: Dimensions;
    }

    type PromptAnswer =
        | MenuAnswer
        | LocationFormAnswer
        | RemoveAnswer
        | ConsultByNameAnswer
        | ConsultByTypeAnswer
        | ConsultByDimensionAnswer;

    interface MockedManager {
        localitations: {
            getAll: ReturnType<typeof vi.fn>;
            add: ReturnType<typeof vi.fn>;
            remove: ReturnType<typeof vi.fn>;
            modify: ReturnType<typeof vi.fn>;
            consultLocationByName: ReturnType<typeof vi.fn>;
            consultLocationByDimension: ReturnType<typeof vi.fn>;
            consultLocationByType: ReturnType<typeof vi.fn>;
        };
        dimensions: {
            getAll: ReturnType<typeof vi.fn>;
        };
        characters: {
            remove: ReturnType<typeof vi.fn>;
        };
    }

    const promptsMock = vi.mocked(prompts);
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const baseDimension: Dimensions = new Dimensions('D-001', 'C-137', DimensionState.ACTIVA, 10, 'Dimensión base');

    const manager: MockedManager = {
        localitations: {
            getAll: vi.fn(),
            add: vi.fn(),
            remove: vi.fn(),
            modify: vi.fn(),
            consultLocationByName: vi.fn(),
            consultLocationByDimension: vi.fn(),
            consultLocationByType: vi.fn()
        },
        dimensions: {
            getAll: vi.fn()
        },
        characters: {
            remove: vi.fn()
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
        manager.localitations.getAll.mockResolvedValue([]);
        manager.localitations.add.mockResolvedValue(undefined);
        manager.localitations.remove.mockResolvedValue(undefined);
        manager.localitations.modify.mockResolvedValue(true);
        manager.localitations.consultLocationByName.mockResolvedValue([]);
        manager.localitations.consultLocationByDimension.mockResolvedValue([]);
        manager.localitations.consultLocationByType.mockResolvedValue([]);
        manager.dimensions.getAll.mockResolvedValue([baseDimension]);
        manager.characters.remove.mockResolvedValue(undefined);
    });

    test('lista localizaciones y vuelve al menú principal', async () => {
        const mockLocations: Planets[] = [
            new Planets('L-001', 'Tierra', 'Planeta', baseDimension, 1000, 'Planeta principal')
        ];
        manager.localitations.getAll.mockResolvedValue(mockLocations);

        queuePrompts(
            { option: 'list' },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(manager.localitations.getAll).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(mockLocations);
    });

    test('añade una localización correctamente', async () => {
        queuePrompts(
            { option: 'add' },
            {
                id: 'L-010',
                name: 'Gazorpazorp',
                type: 'Planeta',
                dimension: baseDimension,
                population: 500,
                desc: 'Mundo hostil'
            },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(manager.dimensions.getAll).toHaveBeenCalledTimes(1);
        expect(manager.localitations.add).toHaveBeenCalledTimes(1);
        expect(manager.localitations.add.mock.calls[0]?.[0]).toBeInstanceOf(Planets);
        expect(manager.localitations.add.mock.calls[0]?.[0]?.id).toBe('L-010');
        expect(consoleLogSpy).toHaveBeenCalledWith('La localización L-010 ha sido añadida correctamente\n');
    });

    test('muestra error al fallar al añadir localización', async () => {
        manager.localitations.add.mockRejectedValue(new Error('No se puede añadir esa localización'));

        queuePrompts(
            { option: 'add' },
            {
                id: 'L-001',
                name: 'Tierra',
                type: 'Planeta',
                dimension: baseDimension,
                population: 1000,
                desc: 'Planeta principal'
            },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(manager.localitations.add).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith('Error', 'No se puede añadir esa localización');
    });

    test('elimina una localización por ID', async () => {
        queuePrompts(
            { option: 'remove' },
            { id: 'L-003' },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(manager.characters.remove).toHaveBeenCalledWith('L-003');
        expect(consoleLogSpy).toHaveBeenCalledWith('La localización L-003 ha sido eliminada correctamente\n');
    });

    test('modifica una localización enviando solo los campos editados', async () => {
        queuePrompts(
            { option: 'modify' },
            {
                id: 'L-002',
                name: 'Nueva Tierra',
                type: 'Planeta',
                dimension: baseDimension,
                population: 1200,
                desc: 'Versión alternativa'
            },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(manager.dimensions.getAll).toHaveBeenCalledTimes(1);
        expect(manager.localitations.modify).toHaveBeenCalledWith('L-002', {
            name: 'Nueva Tierra',
            type: 'Planeta',
            dimension: baseDimension,
            population: 1200,
            desc: 'Versión alternativa'
        });
        expect(consoleLogSpy).toHaveBeenCalledWith('La localización L-002 ha sido modificada correctamente\n');
    });

    test('muestra error al eliminar localización', async () => {
        manager.characters.remove.mockRejectedValue(new Error('No se puede eliminar esa localización'));

        queuePrompts(
            { option: 'remove' },
            { id: 'L-404' },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(manager.characters.remove).toHaveBeenCalledWith('L-404');
        expect(consoleLogSpy).toHaveBeenCalledWith('Error', 'No se puede eliminar esa localización');
    });

    test('muestra aviso al añadir sin dimensiones disponibles', async () => {
        manager.dimensions.getAll.mockResolvedValue([]);

        queuePrompts(
            { option: 'add' },
            {
                id: 'L-100',
                name: 'Sin dimensión',
                type: 'Planeta',
                dimension: baseDimension,
                population: 1,
                desc: 'Sin catálogo'
            },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(consoleLogSpy).toHaveBeenCalledWith('No hay dimensiones disponibles');
    });

    test('muestra aviso al modificar sin dimensiones disponibles', async () => {
        manager.dimensions.getAll.mockResolvedValue([]);

        queuePrompts(
            { option: 'modify' },
            {
                id: 'L-101',
                name: 'Cambio',
                type: 'Planeta',
                dimension: baseDimension,
                population: 2,
                desc: 'Sin catálogo'
            },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(consoleLogSpy).toHaveBeenCalledWith('No hay dimensiones disponibles');
    });

    test('muestra error al modificar localización', async () => {
        manager.localitations.modify.mockRejectedValue(new Error('No se puede modificar esa localización'));

        queuePrompts(
            { option: 'modify' },
            {
                id: 'L-102',
                name: 'Cambio X',
                type: 'Planeta',
                dimension: baseDimension,
                population: 10,
                desc: 'Error esperado'
            },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(manager.localitations.modify).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith('Error', 'No se puede modificar esa localización');
    });

    test('consulta por nombre con resultados', async () => {
        const mockLocations: Planets[] = [
            new Planets('L-200', 'Tierra', 'Planeta', baseDimension, 1000, 'Planeta azul')
        ];
        manager.localitations.consultLocationByName.mockResolvedValue(mockLocations);

        queuePrompts(
            { option: 'consult by name' },
            { name: 'Tierra' },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(manager.localitations.consultLocationByName).toHaveBeenCalledWith('Tierra');
        expect(consoleLogSpy).toHaveBeenCalledWith('Se encontraron 1 localizaciones con el nombre Tierra\n');
    });

    test('consulta por nombre sin resultados', async () => {
        manager.localitations.consultLocationByName.mockResolvedValue([]);

        queuePrompts(
            { option: 'consult by name' },
            { name: 'NoExiste' },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(consoleLogSpy).toHaveBeenCalledWith('No se encontraron resultados');
    });

    test('consulta por tipo con resultados', async () => {
        const mockLocations: Planets[] = [
            new Planets('L-201', 'Gazorpazorp', 'Planeta', baseDimension, 500, 'Hostil')
        ];
        manager.localitations.consultLocationByType.mockResolvedValue(mockLocations);

        queuePrompts(
            { option: 'consult by type' },
            { type: 'Planeta' },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(manager.localitations.consultLocationByType).toHaveBeenCalledWith('Planeta');
        expect(consoleLogSpy).toHaveBeenCalledWith('Se encontraron 1 localizaciones con el tipo Planeta\n');
    });

    test('consulta por dimensión con resultados', async () => {
        const mockLocations: Planets[] = [
            new Planets('L-202', 'Cronenberg World', 'Planeta', baseDimension, 300, 'Mutado')
        ];
        manager.localitations.consultLocationByDimension.mockResolvedValue(mockLocations);

        queuePrompts(
            { option: 'consult by dimension' },
            { dimension: baseDimension },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(manager.localitations.consultLocationByDimension).toHaveBeenCalledWith(baseDimension);
        expect(consoleLogSpy).toHaveBeenCalledWith(`Se encontraron 1 localizaciones en la dimensión ${baseDimension}\n`);
    });

    test('consulta por dimensión sin resultados', async () => {
        manager.localitations.consultLocationByDimension.mockResolvedValue([]);

        queuePrompts(
            { option: 'consult by dimension' },
            { dimension: baseDimension },
            { option: 'back' }
        );

        await localitationMenu(manager as unknown as MultiverseManager);

        expect(consoleLogSpy).toHaveBeenCalledWith('No se encontraron resultados');
    });
});