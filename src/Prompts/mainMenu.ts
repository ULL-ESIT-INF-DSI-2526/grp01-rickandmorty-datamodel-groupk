import prompts from "prompts";

/**
 * Menu principal de la consola
 * @returns Opcion seleccionada
 */
export async function mainMenu(): Promise<string> {
    const res = await prompts({
        type: 'select',
        name: 'option',
        message: 'Gestor del multiverso',
        choices: [
            { title: 'Dimensiones', value: 'dimensions' },
            { title: 'Personajes', value: 'characters' },
            { title: 'Localizaciones', value: 'localitations' },
            { title: 'Especies', value: 'species' },
            { title: 'Inventos', value: 'invents' },
            { title: 'Eventos', value: 'events' },
            { title: 'Informes', value: 'reports' },
            { title: 'Salir', value: 'exit' }
        ]
    });

    return res.option;
}