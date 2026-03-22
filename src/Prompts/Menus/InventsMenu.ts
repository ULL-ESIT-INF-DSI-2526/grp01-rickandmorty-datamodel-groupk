import prompts from "prompts";

import { MultiverseManager } from "../../Servicies/Multiverse.js";
import { Invents } from "../../Class/Invents.js";
import { Character } from "../../Class/Character.js";

/**
 * Función del menu principal de inventos
 * @param manager - Instancia del MultiverseManager que contiene todos los servicios
 */
export async function inventsMenu(manager: MultiverseManager) {
    let back = false;
        /** Bucle para elegir la opción que se va a realizar */
        while(!back) {
            const res = await prompts({
                type: 'select',
                name: 'option',
                message: 'Menú de inventos',
                choices: [
                    { title: 'Ver inventos', value: 'list' },
                    { title: 'Añadir invento', value: 'add' },
                    { title: 'Eliminar invento', value: 'remove' },
                    { title: 'Modificar invento', value: 'modify' },
                    { title: 'Consultar invento por nombre', value: 'consult by name'},
                    { title: 'Consultar invento por tipo', value: 'consult by type'},
                    { title: 'Consultar invento por inventor', value: 'consult by inventor'},
                    { title: 'Consultar invento por peligrosidad', value: 'consult by dangerlevel'},
                    { title: 'Volver', value: 'back' }
                ]
            });
    
            /** Seleccion de la opcion a realizar */
            switch (res.option) {
                case 'list':
                    const invents = await manager.invents.getAll();
                    console.log(invents);
                    break;
                
                case 'add':
                    await addInvent(manager);
                    break;
    
                case 'remove':
                    await removeInvent(manager);
                    break;
                
                case 'modify':
                    await modifyInvent(manager);
                    break;
    
                case 'consult by name':
                    await consutlByName(manager);
                    break;
                
                case 'consult by type':
                    await consutlByType(manager);
                    break;

                case 'consult by inventor':
                    await consultByInventor(manager);
                    break;

                case 'consult by dangerlevel':
                    await consultByDangerLevel(manager);
                    break;
    
                case 'back':
                    back = true;
                    break;
            }
        }

        /**
         * Prompt para anadir un nuevo invento
         * @param manager - Instancia del MultiverseManager que contiene todos los servicios
         */
        async function addInvent(manager: MultiverseManager) {
            const character = await manager.characters.getAll();
    
            if(character.length === 0){
                console.log("No hay personajes disponibles");
            }
    
            const characterChoices = character.map(d => ({
                title: `${d.name} (${d.id})`,
                value: d
            }));
    
            const data = await prompts([
                {
                    type: 'text',
                    name: 'id',
                    message: 'Introduce el ID del invento a añadir:',
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
                    name: 'inventor',
                    message: 'Selecciona el inventor del invento:',
                    choices: characterChoices
                },
                {
                    type: 'text',
                    name: 'type',
                    message: 'Selecciona el tipo del invento:',
                    validate: type => type.length > 0 ? true : "Debe de tener un tipo"
                },
                {
                    type: 'number',
                    name: 'dangerlevel',
                    message: 'Selecciona el nivel de peligrosidad:',
                    validate: techlevel => techlevel >= 1 && techlevel <= 10 ? true : "Debe ser entre 1-10"
                },
                {
                    type: 'text',
                    name: 'desc',
                    message: 'Descripción:',
                    validate: desc => desc.length > 0 ? true : "Debe de tener descripción"
                }
            ]);

            /** Construye invento y validacion de error */
            try {
                const newInvent = new Invents(
                    data.id,
                    data.name,
                    data.inventor,
                    data.type,
                    data.dangerlevel,
                    data.desc
                );
    
                await manager.invents.add(newInvent);
                console.log(`El invento ${data.id} ha sido añadidocorrectamente\n`);
    
            } catch (error: any) {
                console.log("Error", error.message);
            }
        }

        /**
         * Prompt para eliminar un invento
         * @param manager - Instancia del MultiverseManager que contiene todos los servicios
         */
        async function removeInvent(manager: MultiverseManager) {
            const {id} = await prompts({
                type: 'text',
                name: 'id',
                message: 'ID del invento a eliminar',
                validate: id => id.length > 0 ? true : "Debe de tener un ID"
            });

            /** Notifica que se elimino invento o error */
            try {
                await manager.invents.remove(id);
                console.log(`El invento ${id} ha sido eliminado correctamente\n`)
            } catch (error: any) {
                console.log("Error", error.message);
            }

        }

        /**
         * Prompt para modificar un invento
         * @param manager
         */
        async function modifyInvent(manager: MultiverseManager) {
            const character = await manager.characters.getAll();
    
            if(character.length === 0){
                console.log("No hay personajes disponibles");
            }
    
            const characterChoices = character.map(d => ({
                title: `${d.name} (${d.id})`,
                value: d
            }));
    
            const data = await prompts([
                {
                    type: 'text',
                    name: 'id',
                    message: 'Introduce el ID del invento a modificar:',
                    validate: id => id.length > 0 ? true : "Debe de tener un ID"
                },
                {
                    type: 'text',
                    name: 'name',
                    message: 'Nuevo nombre (Enter para no modificar):',
                },
                {
                    type: 'select',
                    name: 'inventor',
                    message: 'Selecciona el nuevo inventor (Enter para no modificar):',
                    choices: characterChoices
                },
                {
                    type: 'text',
                    name: 'type',
                    message: 'Selecciona el nuevo tipo:',
                },
                {
                    type: 'number',
                    name: 'dangerlevel',
                    message: 'Nuevo nivel de peligrosidad (Enter para no modificar):'
                },
                {
                    type: 'text',
                    name: 'desc',
                    message: 'Nueva escripción (Enter para no modificar):'
                }
            ]);

            /** Modifica el invento y validacion de error */
            try {
                const mod: any = {};
                if(data.name) mod.name = data.name;
                if(data.type) mod.type = data.type;
                if(data.inventor) mod.inventor = data.inventor;
                if(!isNaN(data.dangerlevel)) mod.dangerlevel = data.dangerlevel;
                if(data.desc) mod.desc = data.desc;
    
                const res = await manager.invents.modify(data.id, mod);
                console.log(`El invento ${data.id} ha sido modificado correctamente\n`);
            } catch (error: any) {
                console.log("Error", error.message);
            } 
        }

        /**
         * Prompt para buscar invento por el nombre
         * @param manager - Instancia del MultiverseManager que contiene todos los servicios
         */
        async function consutlByName(manager: MultiverseManager) {
            const data = await prompts([
                {
                    type: 'text',
                    name: 'name',
                    message: 'Introduce el nombre del invento a consultar:',
                    validate: name => name.length > 0 ? true : "Debe de tener un nombre"
                }
            ]);

            /** Busca el invento, ya sea que lo encuentre o no y validacion de error */
            try {
            const names: string = data.name;
    
            const res: Invents[] = await manager.invents.consultInventByName(names.trim());
    
            if(res.length == 0) {
                console.log('No se encontraron resultados');
            } else {
                console.log(`Se encontraron ${res.length} inventos con el nombre ${names}\n`);
                res.forEach((i: Invents, index: number) => {
                console.log(`${index + 1}. ${i.name} 
                             ID: ${i.id} 
                             Inventor: ${i.inventor} 
                             Tipo: ${i.type} 
                             Nivel de peligrosidad: ${i.dangerLevel}
                             Descripción: ${i.desc}\n`);
                            });
            }
    
            } catch (error: any) {
                console.log("Error", error.message);
            }
        }

        /**
         * Prompt para buscar invento por el tipo
         * @param manager - Instancia del MultiverseManager que contiene todos los servicios
         */
        async function consutlByType(manager: MultiverseManager) {
            const data = await prompts([
                {
                    type: 'text',
                    name: 'type',
                    message: 'Introduce el tipo del invento a consultar:',
                    validate: type => type.length > 0 ? true : "Debe de tener un tipo"
                }
            ]);

            /** Busca el invento, ya sea que lo encuentre o no y validacion de error */
            try {
            const types: string = data.type;
    
            const res: Invents[] = await manager.invents.consultInventByType(types.trim());
    
            if(res.length == 0) {
                console.log('No se encontraron resultados');
            } else {
                console.log(`Se encontraron ${res.length} inventos con el nombre ${types}\n`);
                res.forEach((i: Invents, index: number) => {
                console.log(`${index + 1}. ${i.name} 
                             ID: ${i.id} 
                             Inventor: ${i.inventor} 
                             Tipo: ${i.type} 
                             Nivel de peligrosidad: ${i.dangerLevel}
                             Descripción: ${i.desc}\n`);
                            });
            }
    
            } catch (error: any) {
                console.log("Error", error.message);
            }
        }

        /**
         * Prompt para buscar invento por el inventor
         * @param manager - Instancia del MultiverseManager que contiene todos los servicios
         */
        async function consultByInventor(manager: MultiverseManager) {
            const data = await prompts([
                {
                    type: 'text',
                    name: 'inventor',
                    message: 'Introduce el nombre del inventor a consultar:',
                    validate: inventor => inventor.length > 0 ? true : "Debe de tener un inventor"
                }
            ]);

            /** Busca el invento, ya sea que lo encuentre o no y validacion de error */
            try {
            const inventor: Character = data.inventor;

            const res: Invents[] = await manager.invents.consultInventByInventor(inventor);

            if(res.length == 0) {
                    console.log('No se encontraron resultados');
                } else {
                    console.log(`Se encontraron ${res.length} inventos con el inventor ${inventor}\n`);
                    res.forEach((i: Invents, index: number) => {
                    console.log(`${index + 1}. ${i.name} 
                                ID: ${i.id} 
                                Inventor: ${i.inventor} 
                                Tipo: ${i.type} 
                                Nivel de peligrosidad: ${i.dangerLevel}
                                Descripción: ${i.desc}\n`);
                                });
                }

            } catch (error: any) {
                console.log("Error", error.message);
            }
        }

        /**
         * Prompt para buscar invento por el nivel de peligrosidad
         * @param manager - Instancia del MultiverseManager que contiene todos los servicios
         */
        async function consultByDangerLevel(manager: MultiverseManager) {
            const data = await prompts([
                {
                    type: 'number',
                    name: 'dangerlevel',
                    message: 'Introduce el nivel de peligrosidad del invento a consultar:',
                    validate: dangerlevel => dangerlevel >= 1 && dangerlevel <= 10 ? true : "Debe ser entre 1-10"
                }
            ]);

            /** Busca el invento, ya sea que lo encuentre o no y validacion de error */
            try {
            const dangerlevels: number = data.dangerlevel;
    
            const res: Invents[] = await manager.invents.consultInventByDangerLevel(dangerlevels);
    
            if(res.length == 0) {
                console.log('No se encontraron resultados');
            } else {
                console.log(`Se encontraron ${res.length} inventos con nivel de peligrosidad ${dangerlevels}\n`);
                    res.forEach((i: Invents, index: number) => {
                    console.log(`${index + 1}. ${i.name} 
                                ID: ${i.id} 
                                Inventor: ${i.inventor} 
                                Tipo: ${i.type} 
                                Nivel de peligrosidad: ${i.dangerLevel}
                                Descripción: ${i.desc}\n`);
                                });
            }
    
            } catch (error: any) {
                console.log("Error", error.message);
            }
        }
}