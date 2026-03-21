import prompts from 'prompts';

import { MultiverseManager } from "../../Servicies/Multiverse.js";
import { Character } from '../../Class/Character.js';
import { Species } from '../../Class/Species.js';
import { Dimensions } from '../../Class/Dimensions.js';

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
                { title: 'Consultar personajes por nombre', value: 'consult by name'},
                { title: 'Consultar personajes por afiliación', value: 'consult by afiliation'},
                { title: 'Consultar personajes por especie', value: 'consult by specie'},
                { title: 'Consultar personajes por estado', value: 'consult by state'},
                { title: 'Consultar personajes por dimensión', value: 'consult by dimension'},
                { title: 'Encontrar versiones alternativas', value: 'fins alternative versions'},
                { title: 'Ordenar personajes', value: 'sort characters'},
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

            case 'consult by name':
                await consutlByName(manager);
                break;
            
            case 'consult by afiliation':
                await consutlByAfiliation(manager);
                break;

            case 'consult by specie':
                await consutlBySpecies(manager);
                break;

            case 'consult by state':
                await consutlByState(manager);
                break;

            case 'consult by dimension':
                await consultByDimension(manager);
                break;

            case 'sort characters':
                await sort(manager);
                break;

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
                message: 'Introduce el ID de la personaje a modificar:',
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
            console.log(`El personaje ${data.id} ha sido añadido correctamente\n`);

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
            console.log(`El personaje ${id} ha sido eliminado correctamente\n`)
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
                message: 'Nuevo estado (Enter para no modificar):'
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
            console.log(`El personaje ${data.id} ha sido modificado correctamente\n`);
        } catch (error: any) {
            console.log("Error", error.message);
        } 
    }

    async function consutlByName(manager: MultiverseManager) {
        const data = await prompts([
            {
                type: 'text',
                name: 'name',
                message: 'Introduce el nombre del personaje a consultar:',
                validate: name => name.length > 0 ? true : "Debe de tener un nombre"
            }
        ]);
        
        try {
        const names: string = data.name;

        const res: Character[] = await manager.characters.consultCharacterByName(names.trim());

        if(res.length == 0) {
            console.log('No se encontraron resultados');
        } else {
            console.log(`Se encontraron ${res.length} personajes con el nombre ${names}\n`);
            res.forEach((c: Character, index: number) => {
            console.log(`${index + 1}. ${c.name} 
                         ID: ${c.id} 
                         Dimensión: ${c.dimension} 
                         Especie: ${c.species} 
                         Afiliación: ${c.afiliation} 
                         IQ: ${c.iq}
                         Descripción: ${c.desc}\n`);
                        });
        }

        } catch (error: any) {
            console.log("Error", error.message);
        }
    }

    async function consutlByAfiliation(manager: MultiverseManager) {
        const data = await prompts([
            {
                type: 'text',
                name: 'afiliation',
                message: 'Introduce el nombre de la afiliación a consultar:',
                validate: afiliation => afiliation.length > 0 ? true : "Debe de tener una afiliación"
            }
        ]);

        try {
        const affs: string = data.afiliation;

        const res: Character[] = await manager.characters.consultCharacterByAfilation(affs.trim());

        if(res.length == 0) {
            console.log('No se encontraron resultados');
        } else {
            console.log(`Se encontraron ${res.length} personajes con la afiliación ${affs}\n`);
            res.forEach((c: Character, index: number) => {
            console.log(`${index + 1}. ${c.name} 
                         ID: ${c.id} 
                         Dimensión: ${c.dimension} 
                         Especie: ${c.species} 
                         Afiliación: ${c.afiliation} 
                         IQ: ${c.iq}
                         Descripción: ${c.desc}\n`);
                        });
        }

        } catch (error: any) {
            console.log("Error", error.message);
        }
    }

    async function consutlBySpecies(manager: MultiverseManager) {
        const data = await prompts([
            {
                type: 'text',
                name: 'specie',
                message: 'Introduce el nombre de la especie a consultar:',
                validate: specie => specie.length > 0 ? true : "Debe de tener una especie"
            }
        ]);

        try {
        const species: Species = data.specie;

        const res: Character[] = await manager.characters.consultCharacterBySpecies(species);

        if(res.length == 0) {
            console.log('No se encontraron resultados');
        } else {
            console.log(`Se encontraron ${res.length} personajes con la especie ${species}\n`);
            res.forEach((c: Character, index: number) => {
            console.log(`${index + 1}. ${c.name} 
                         ID: ${c.id} 
                         Dimensión: ${c.dimension} 
                         Especie: ${c.species} 
                         Afiliación: ${c.afiliation} 
                         IQ: ${c.iq}
                         Descripción: ${c.desc}\n`);
                        });
        }

        } catch (error: any) {
            console.log("Error", error.message);
        }
    }

    async function consutlByState(manager: MultiverseManager) {
        const data = await prompts([
            {
                type: 'text',
                name: 'state',
                message: 'Introduce el nombre del estado a consultar:',
                validate: state => state.length > 0 ? true : "Debe de tener un estado"
            }
        ]);

        try {
        const state: string = data.state;

        const res: Character[] = await manager.characters.consultCharacterByState(state.trim());

        if(res.length == 0) {
            console.log('No se encontraron resultados');
        } else {
            console.log(`Se encontraron ${res.length} personajes con el estado ${state}\n`);
            res.forEach((c: Character, index: number) => {
            console.log(`${index + 1}. ${c.name} 
                         ID: ${c.id} 
                         Dimensión: ${c.dimension} 
                         Especie: ${c.species} 
                         Afiliación: ${c.afiliation} 
                         IQ: ${c.iq}
                         Descripción: ${c.desc}\n`);
                        });
        }

        } catch (error: any) {
            console.log("Error", error.message);
        }
    }

    async function consultByDimension(manager: MultiverseManager) {
        const data = await prompts([
            {
                type: 'text',
                name: 'dimension',
                message: 'Introduce el id de la dimensión a consultar:',
                validate: dimension => dimension.length > 0 ? true : "Debe de tener una dimensión"
            }
        ]);

        try {
        const dimension: Dimensions = data.dimension;

        const res: Character[] = await manager.characters.consultCharacterByDimension(dimension);

        if(res.length == 0) {
            console.log('No se encontraron resultados');
        } else {
            console.log(`Se encontraron ${res.length} personajes con la dimensión ${dimension}\n`);
            res.forEach((c: Character, index: number) => {
            console.log(`${index + 1}. ${c.name} 
                         ID: ${c.id} 
                         Dimensión: ${c.dimension} 
                         Especie: ${c.species} 
                         Afiliación: ${c.afiliation} 
                         IQ: ${c.iq}
                         Descripción: ${c.desc}\n`);
                        });
        }

        } catch (error: any) {
            console.log("Error", error.message);
        }
    }

    async function sort(manager: MultiverseManager) {
        const data = await prompts([
            {
                type: 'select',
                name: 'sortType',
                message: 'Elige sobre qué quieres ordenar:',
                choices: [
                    { title: 'Nombre del personaje', value: 1 },
                    { title: 'IQ del personaje', value: 2 }
                ]
            },
            {
                type: 'select',
                name: 'sortDir',
                message: 'Elige el orden (Ascendente o Descendente):',
                choices: [
                    { title: 'Ascendente', value: false },
                    { title: 'Descendente', value: true }
                ]
            }
        ]);

        try {
            const character = await manager.characters.getAll();
            const sort = await manager.characters.applySorting(character, data.sortDir, data.sortType);
            console.log("\nPersonajes ordenados:\n");

            if(sort.length === 0) { console.log('No hay personajes para ordenar'); }

            if(data.sortType === 1) {
                sort.forEach((c, index) => {
                console.log(`${index + 1}. ${c.name}
                    ID: ${c.id}
                    Name: ${c.name}
                    -------------------------`);
                });
            } else {
                sort.forEach((c, index) => {
                console.log(`${index + 1}. ${c.name}
                    ID: ${c.id}
                    IQ: ${c.iq}
                    -------------------------`);
                });
            }

        } catch (error: any) {
            console.log("Error al ordenar:", error.message);
        }

    }
}