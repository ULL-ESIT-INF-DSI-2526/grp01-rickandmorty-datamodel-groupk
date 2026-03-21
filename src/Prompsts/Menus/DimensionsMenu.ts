import prompts from "prompts";

import { MultiverseManager } from "../../Servicies/Multiverse.js";
import { DimensionServices } from "../../Servicies/DimensionServices.js";
import { getSourceMapsSupport } from "node:module";

export async function dimensionsMenu(manager: MultiverseManager) {
    let back = false;

    while(!back) {
        const res = await prompts({
            type: 'select',
            name: 'option',
            message: 'Menú de dimensiones',
            choices: [
                { title: 'Ver dimensiones', value: 'list' },
                { title: 'Añadir dimensión', value: 'add' },
                { title: 'Eliminar dimensión', value: 'remove' },
                { title: 'Modificar dimensión', value: 'modify' },
                { title: 'Volver', value: 'back' }
            ]
        });

        switch (res.option) {
            case 'list':
                const dimensions = await manager.dimensions.getAll();
                console.log(dimensions);
                break;
            
            case 'add':
                await addDimension(manager);
                break;

            case 'remove':
                await removeDimension(manager);
                break;
            
            case 'modify':
                await modifyDimension(manager);
                break;

            case 'back':
                back = true;
                break;
        }
    }
}