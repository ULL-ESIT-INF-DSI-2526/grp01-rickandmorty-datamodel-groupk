import prompts from "prompts";

import { MultiverseManager } from "../../Servicies/Multiverse.js";
import { Species } from "../../Class/Species.js";

/**
 * Funcion del menu principal de especies
 * @param manager
 */
export async function speciesMenu(manager: MultiverseManager) {
    let back = false;

        /** Bucle para elegir la opcion que se va a realizar */
        while(!back) {
            const res = await prompts({
                type: 'select',
                name: 'option',
                message: 'Menú de especies',
                choices: [
                    { title: 'Ver especies', value: 'list' },
                    { title: 'Añadir especie', value: 'add' },
                    { title: 'Eliminar especie', value: 'remove' },
                    { title: 'Modificar especie', value: 'modify' },
                    { title: 'Volver', value: 'back' }
                ]
            });

            /** Seleccion de la opcion a realizar */
            switch (res.option) {
                case 'list':
                    const species = await manager.species.getAll();
                    console.log(species);
                    break;
                
                case 'add':
                    await addSpecie(manager);
                    break;
    
                case 'remove':
                    await removeSpecie(manager);
                    break;
                
                case 'modify':
                    await modifySpecie(manager);
                    break;
    
                case 'back':
                    back = true;
                    break;
            }
        }

        /**
         * Prompt para anadir una nueva especie
         * @param manager
         */
        async function addSpecie(manager: MultiverseManager) {
            const dimensions = await manager.dimensions.getAll();
            const localitations = await manager.localitations.getAll();

            if(dimensions.length === 0){
                console.log("No hay dimensiones disponibles");
            }

            if(localitations.length === 0){
                console.log("No hay localizaciones disponibles");
            }

            const dimensionChoices = dimensions.map(d => ({
                title: `${d.name} (${d.id})`,
                value: d
            }));

            const localitationChoices = localitations.map(l => ({
                title: `${l.name} (${l.id})`,
                value: l
            }));

            const data = await prompts([
                {
                    type: 'text',
                    name: 'id',
                    message: 'Introduce el ID de la especie a añadir:',
                    validate: id => id.length > 0 ? true : "Debe de tener un ID"
                },
                {
                    type: 'text',
                    name: 'name',
                    message: 'Nombre:',
                    validate: name => name.length > 0 ? true : "Debe de tener un nombre"
                },
                {
                    type: 'select',
                    name: 'origin',
                    message: 'Origen de la especie:',
                    choices: dimensionChoices || localitationChoices
                },
                {
                    type: 'text',
                    name: 'type',
                    message: 'Tipo de la especie:',
                    validate: type => type.length > 0 ? true : "Debe de tener un tipo"
                },
                {
                    type: 'text',
                    name: 'expectancy',
                    message: 'Esperanza de vida de la especie:',
                    validate: expectancy => expectancy.length > 0 ? true : "Debe de tener una esperanza de vida media"
                },
                {
                    type: 'text',
                    name: 'desc',
                    message: 'Descripción:',
                    validate: desc => desc.length > 0 ? true : "Debe de tener descripción"
                }
            ]);

            /** Construye especie y validacion de error */
            try {
                const newSpecie = new Species(
                    data.id,
                    data.name,
                    data.origin,
                    data.type,
                    data.expectancy,
                    data.desc
                );
    
                await manager.species.add(newSpecie);
                console.log(`La especie ${data.id} ha sido añadida correctamente`);
    
            } catch (error: any) {
                console.log("Error", error.message);
            }
        }

        /**
         * Prompt para eliminar una especie
         * @param manager
         */
        async function removeSpecie(manager: MultiverseManager) {
            const {id} = await prompts({
                type: 'text',
                name: 'id',
                message: 'ID de la especie a eliminar',
                validate: id => id.length > 0 ? true : "Debe de tener un ID"
            });

            /** Notifica que se elimino especie o error */
            try {
                await manager.species.remove(id);
                console.log(`La especie ${id} ha sido eliminada correctamente`)
            } catch (error: any) {
                console.log("Error", error.message);
            }

        }

        /**
         * Prompt para modificar una especie
         * @param manager
         */
        async function modifySpecie(manager: MultiverseManager) {
            const dimensions = await manager.dimensions.getAll();
            const localitations = await manager.localitations.getAll();

            if(dimensions.length === 0){
                console.log("No hay dimensiones disponibles");
            }

            if(localitations.length === 0){
                console.log("No hay localizaciones disponibles");
            }

            const dimensionChoices = dimensions.map(d => ({
                title: `${d.name} (${d.id})`,
                value: d
            }));

            const localitationChoices = localitations.map(l => ({
                title: `${l.name} (${l.id})`,
                value: l
            }));

            const data = await prompts([
                {
                    type: 'text',
                    name: 'id',
                    message: 'Introduce el ID de la especie a modificar:',
                    validate: id => id.length > 0 ? true : "Debe de tener un ID"
                },
                {
                    type: 'text',
                    name: 'name',
                    message: 'Nuevo nombre (Enter para no modificar):'
                },
                {
                    type: 'text',
                    name: 'origin',
                    message: 'Nuevo estado:',
                    choices: [
                        { title: 'No cambiar', value: null }, ...dimensionChoices,
                        { title: 'No cambiar', value: null }, ...localitationChoices
                    ]
                },
                {
                    type: 'text',
                    name: 'type',
                    message: 'Nuevo tipo (Enter para no modificar):'            
                },
                {
                    type: 'text',
                    name: 'expectancy',
                    message: 'Nueva esperanza de vida (Enter para no modificar):'            
                },
                {
                    type: 'text',
                    name: 'desc',
                    message: 'Nueva descripción (Enter para no modificar):'
                }
            ]);

            /** Modifica la especie y validacion de error */
            try {
                const mod: any = {};
                if(data.name) mod.name = data.name;
                if(data.origin) mod.origin = data.origin;
                if(data.type) mod.type = data.type;
                if(!isNaN(data.expectancy)) mod.expectancy = data.expectancy;
                if(data.desc) mod.desc = data.desc;
    
                const res = await manager.species.modify(data.id, mod);
                console.log(`La especie ${data.id} ha sido modificada correctamente`);
            } catch (error: any) {
                console.log("Error", error.message);
            } 
        }
}