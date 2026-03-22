import prompts from "prompts";

import { MultiverseManager } from "../../Servicies/Multiverse.js";
import { Dimensions } from "../../Class/Dimensions.js";
import { DimensionState } from "../../Enums/DimensionState.js";

/**
 * Función del menu principal de dimensiones
 * @param manager - Instancia del MultiverseManager que contiene todos los servicios
 */
export async function dimensionsMenu(manager: MultiverseManager) {
    let back = false;
    /** Bucle para elefir la opcion que se va a realizar */
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

        // Selección de la opción a realizar
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

    /**
     * Prompt para añadir una nueva dimensión
     * @param manager - Instancia del MultiverseManager que contiene todos los servicios
     */
    async function addDimension(manager: MultiverseManager) {
        /** Información necesaria para poder añadir la dimensión */
        const data = await prompts([
            {
                type: 'text',
                name: 'id',
                message: 'Introduce el ID de la dimensión a añadir:',
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
                name: 'state',
                message: 'Estado:',
                choices: [
                    { title: 'Activa', value: DimensionState.ACTIVA },
                    { title: 'Cuatentena', value: DimensionState.CUARENTENA},
                    { title: 'Destruida', value: DimensionState.DESTRUIDA},
                ]
            },
            {
                type: 'number',
                name: 'techlevel',
                message: 'Nivel tecnológico:',
                validate: techlevel => techlevel >= 1 && techlevel <= 10 ? true : "Debe ser entre 1-10"
            },
            {
                type: 'text',
                name: 'desc',
                message: 'Descripción:',
                validate: desc => desc.length > 0 ? true : "Debe de tener descripción"
            }
        ]);
        
        /** Construye dimension y validación de error */
        try {
            const newDimension = new Dimensions(
                data.id,
                data.name,
                data.state,
                data.techlevel,
                data.desc
            );

            await manager.dimensions.add(newDimension);
            console.log(`La dimensión ${data.id} ha sido añadida correctamente`);

        } catch (error: any) {
            console.log("Error", error.message);
        }
    }

    /**
     * Prompt para eliminar una dimensión 
     * @param manager 
     */
    async function removeDimension(manager: MultiverseManager) {
        const {id} = await prompts({
            type: 'text',
            name: 'id',
            message: 'ID de la dimensión a eliminar',
            validate: id => id.length > 0 ? true : "Debe de tener un ID"
        });

        /** Notifica que se elimino la dimensión o error */
        try {
            await manager.dimensions.remove(id);
            console.log(`La dimensión ${id} ha sido eliminada correctamente`)
        } catch (error: any) {
            console.log("Error", error.message);
        }

    }

    /**
     * Prompt para modificar una dimensión
     * @param manager - Instancia del MultiverseManager que contiene todos los servicios
     */
    async function modifyDimension(manager: MultiverseManager) {
        /** Información necesario para poder modificar la dimensión */
        const data = await prompts([
            {
                type: 'text',
                name: 'id',
                message: 'Introduce el ID de la dimensión a modificar:',
                validate: id => id.length > 0 ? true : "Debe de tener un ID"
            },
            {
                type: 'text',
                name: 'name',
                message: 'Nuevo nombre (Enter para no modificar):',
            },
            {
                type: 'select',
                name: 'state',
                message: 'Nuevo estado:',
                choices: [
                    { title: 'No cambiar', value: null },
                    { title: 'Activa', value: DimensionState.ACTIVA },
                    { title: 'Cuatentena', value: DimensionState.CUARENTENA},
                    { title: 'Destruida', value: DimensionState.DESTRUIDA},
                ]
            },
            {
                type: 'number',
                name: 'techlevel',
                message: 'Nuevo nivel tecnológico (Enter para no modificar):'            
            },
            {
                type: 'text',
                name: 'desc',
                message: 'Nueva descripción (Enter para no modificar):'
            }
        ]);
        
        /** Modifica la dimensión y validación de errores */
        try {
            const mod: any = {};
            if(data.name) mod.name = data.name;
            if(data.state !== null) mod.state = data.state;
            if(!isNaN(data.techlevel)) mod.techlevel = data.techlevel;
            if(data.desc) mod.desc = data.desc;

            const res = await manager.dimensions.modify(data.id, mod);
            console.log(`La dimensión ${data.id} ha sido modificada correctamente`);
        } catch (error: any) {
            console.log("Error", error.message);
        } 
    }
}