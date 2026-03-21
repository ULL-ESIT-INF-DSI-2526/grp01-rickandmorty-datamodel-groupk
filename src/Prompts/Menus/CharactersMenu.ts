import prompts from 'prompts';

import { MultiverseManager } from "../../Servicies/Multiverse.js";
import { Character } from '../../Class/Character.js';
import { Dimensions } from '../../Class/Dimensions.js';
import { DataFileSync } from 'lowdb/node';

export async function charactersMenu(manager: MultiverseManager) {
    let back = false;

    while(!back) {
        const res = await prompts({
            type: 'select',
            name: 'option',
            message: 'Menú de personajes',
            choices: [
                { title: 'Ver personajes', value: 'list' },
                { title: 'Añadir personaje', value: 'add' },
                { title: 'Eliminar personaje', value: 'remove' },
                { title: 'Modificar personaje', value: 'modify' },
                { title: 'Hacer consultas sobre el personaje', value: 'consult'},
                { title: 'Volver', value: 'back' }
            ]
        });

        switch (res.option) {
            case 'list':
                const characters = await manager.characters.getAll();
                console.log(characters);
                break;
            
            case 'add':
                await addCharacter(manager);
                break;

            case 'remove':
                await removeCharacter(manager);
                break;
            
            case 'modify':
                await modifyCharacter(manager);
                break;

            case 'consult':

            case 'back':
                back = true;
                break;
        }
    }
    
    async function addCharacter(manager: MultiverseManager) {
        const dimensions = await manager.dimensions.getAll();
        const species = await manager.species.getAll();

        if(dimensions.length === 0){
            console.log("No hay dimensiones disponibles");
        }

        if(species.length === 0){
            console.log("No hay especies disponibles");
        }

        const dimensionChoices = dimensions.map(d => ({
            title: `${d.name} (${d.id})`,
            value: d
        }));

        const speciesChoices = species.map(s => ({
            title: `${s.name} (${s.id})`,
            value: s
        }));

        const data = await prompts([
            {
                type: 'text',
                name: 'id',
                message: 'Introduce el ID de la personaje a añadir:',
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
                name: 'specie',
                message: 'Selecciona la especie del personaje:',
                choices: speciesChoices
            },
            {
                type: 'select',
                name: 'dimension',
                message: 'Selecciona la dimensión:',
                choices: dimensionChoices
            },
            {
                type: 'text',
                name: 'state',
                message: 'Estado:',
                validate: state => state.length > 0 ? true : "Debe de tener estado"
            },
            {
                type: 'text',
                name: 'afiliation',
                message: 'Afiliación:',
                validate: afiliation => afiliation.length > 0 ? true : "Debe de tener afiliación"
            },
            {
                type: 'text',
                name: 'iq',
                message: 'IQ del personaje:',
                validate: iq => iq >= 1 && iq <= 10 ? true : "Debe ser entre 1-10"
            },
            {
                type: 'text',
                name: 'desc',
                message: 'Descripción:',
                validate: desc => desc.length > 0 ? true : "Debe de tener descripción"
            }
        ]);

        try {
            const newCharacter = new Character(
                data.id,
                data.name,
                data.specie,
                data.dimension,
                data.state,
                data.afiliation,
                data.iq,
                data.desc
            );

            await manager.characters.add(newCharacter);
            console.log(`El personaje ${data.id} ha sido añadido correctamente`);

        } catch (error: any) {
            console.log("Error", error.message);
        }
    }

    async function removeCharacter(manager: MultiverseManager) {
        const {id} = await prompts({
            type: 'text',
            name: 'id',
            message: 'ID del personaje a eliminar',
            validate: id => id.length > 0 ? true : "Debe de tener un ID"
        });

        try {
            await manager.characters.remove(id);
            console.log(`El personaje ${id} ha sido eliminado correctamente`)
        } catch (error: any) {
            console.log("Error", error.message);
        }

    }

    async function modifyCharacter(manager: MultiverseManager) {
        const dimensions = await manager.dimensions.getAll();
        const species = await manager.species.getAll();

        if(dimensions.length === 0){
            console.log("No hay dimensiones disponibles");
        }

        if(species.length === 0){
            console.log("No hay especies disponibles");
        }

        const dimensionChoices = dimensions.map(d => ({
            title: `${d.name} (${d.id})`,
            value: d
        }));

        const speciesChoices = species.map(s => ({
            title: `${s.name} (${s.id})`,
            value: s
        }));

        const data = await prompts([
            {
                type: 'text',
                name: 'id',
                message: 'Introduce el ID de la personaje a añadir:',
                validate: id => id.length > 0 ? true : "Debe de tener un ID"
            },
            {
                type: 'text',
                name: 'name',
                message: 'Nuevo nombre (Enter para no modificar):',
            },
            {
                type: 'select',
                name: 'specie',
                message: 'Selecciona la nueva especie del personaje:',
                choices: [{ title: 'No cambiar', value: null }, ...speciesChoices]
            },
            {
                type: 'select',
                name: 'dimension',
                message: 'Selecciona la dimensión:',
                choices: [{ title: 'No cambiar', value: null }, ...dimensionChoices]
            },
            {
                type: 'text',
                name: 'state',
                message: 'Nuevo estado:'
            },
            {
                type: 'text',
                name: 'afiliation',
                message: 'Nueva afiliación (Enter para no modificar):'
            },
            {
                type: 'text',
                name: 'iq',
                message: 'Nuevo IQ del personaje (Enter para no modificar):'
            },
            {
                type: 'text',
                name: 'desc',
                message: 'Nueva escripción (Enter para no modificar):'
            }
        ]);

        try {
            const mod: any = {};
            if(data.name) mod.name = data.name;
            if(data.specie) mod.specie = data.specie;
            if(data.dimension) mod.dimension = data.dimension;
            if(data.state !== null) mod.state = data.state;
            if(data.afiliation) mod.afiliation = data.afiliation;
            if(!isNaN(data.iq)) mod.iq = data.iq;
            if(data.desc) mod.desc = data.desc;

            const res = await manager.characters.modify(data.id, mod);
            console.log(`El personaje ${data.id} ha sido modificado correctamente`);
        } catch (error: any) {
            console.log("Error", error.message);
        } 
    }
}