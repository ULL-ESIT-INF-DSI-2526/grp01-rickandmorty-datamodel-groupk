import prompts from "prompts";

import { MultiverseManager } from "../../Servicies/Multiverse.js";
import { Planets } from "../../Class/Planets.js";
import { Dimensions } from "../../Class/Dimensions.js";

/**
 * Funcion del menu principal de localizaciones
 * @param manager - Instancia del MultiverseManager que contiene todos los servicios
 */
export async function localitationMenu(manager: MultiverseManager) {
    let back = false;

        /** Bucle para elegir la opcion que se va a realizar */
        while(!back) {
            const res = await prompts({
                type: 'select',
                name: 'option',
                message: 'Menú de localizaciones',
                choices: [
                    { title: 'Ver localizaciones', value: 'list' },
                    { title: 'Añadir localización', value: 'add' },
                    { title: 'Eliminar localización', value: 'remove' },
                    { title: 'Modificar localización', value: 'modify' },
                    { title: 'Consultar localización por nombre', value: 'consult by name'},
                    { title: 'Consultar localización por tipo', value: 'consult by type'},
                    { title: 'Consultar localización por dimensión', value: 'consult by dimension'},
                    { title: 'Volver', value: 'back' }
                ]
            });

            /** Seleccion de la opcion a realizar */
            switch (res.option) {
                case 'list':
                    const localitations = await manager.localitations.getAll();
                    console.log(localitations);
                    break;
                
                case 'add':
                    await addLocalitation(manager);
                    break;
    
                case 'remove':
                    await removeLocalitation(manager);
                    break;
                
                case 'modify':
                    await modifyLocalitation(manager);
                    break;
    
                case 'consult by name':
                    await consutlByName(manager);
                    break;
                
                case 'consult by type':
                    await consutlByType(manager);
                    break;

                case 'consult by dimension':
                    await consultByDimension(manager);
                    break;
    
                case 'back':
                    back = true;
                    break;
            }
        }

        /**
         * Prompt para anadir una nueva localizacion
         * @param manager - Instancia del MultiverseManager que contiene todos los servicios
         */
        async function addLocalitation(manager: MultiverseManager) {
            const dimensions = await manager.dimensions.getAll();
    
            if(dimensions.length === 0){
                console.log("No hay dimensiones disponibles");
            }
    
            const dimensionChoices = dimensions.map(d => ({
                title: `${d.name} (${d.id})`,
                value: d
            }));
    
            const data = await prompts([
                {
                    type: 'text',
                    name: 'id',
                    message: 'Introduce el ID de la localización a añadir:',
                    validate: id => id.length > 0 ? true : "Debe de tener un ID"
                },
                {
                    type: 'text',
                    name: 'name',
                    message: 'Nombre:',
                    validate: name => name.length > 0 ? true : "Debe de tener un nombre"
                },
                {
                    type: 'text',
                    name: 'type',
                    message: 'Selecciona el tipo del localización:',
                    validate: type => type.length > 0 ? true : "Debe de tener un tipo"
                },
                {
                    type: 'select',
                    name: 'dimension',
                    message: 'Selecciona la dimensión:',
                    choices: dimensionChoices
                },
                {
                    type: 'number',
                    name: 'population',
                    message: 'Población:',
                },
                {
                    type: 'text',
                    name: 'desc',
                    message: 'Descripción:',
                    validate: desc => desc.length > 0 ? true : "Debe de tener descripción"
                }
            ]);

            /** Construye localizacion y validacion de error */
            try {
                const newLocalitation = new Planets(
                    data.id,
                    data.name,
                    data.type,
                    data.dimension,
                    data.population,
                    data.desc
                );
    
                await manager.localitations.add(newLocalitation);
                console.log(`La localización ${data.id} ha sido añadida correctamente\n`);
    
            } catch (error: any) {
                console.log("Error", error.message);
            }
        }

        /**
         * Prompt para eliminar una localizacion
         * @param manager - Instancia del MultiverseManager que contiene todos los servicios
         */
        async function removeLocalitation(manager: MultiverseManager) {
            const {id} = await prompts({
                type: 'text',
                name: 'id',
                message: 'ID de la localización a eliminar',
                validate: id => id.length > 0 ? true : "Debe de tener un ID"
            });

            /** Notifica que se elimino localizacion o error */
            try {
                await manager.characters.remove(id);
                console.log(`La localización ${id} ha sido eliminada correctamente\n`)
            } catch (error: any) {
                console.log("Error", error.message);
            }

        }

        /**
         * Prompt para modificar una localizacion
         * @param manager - Instancia del MultiverseManager que contiene todos los servicios
         */
        async function modifyLocalitation(manager: MultiverseManager) {
            const dimensions = await manager.dimensions.getAll();
    
            if(dimensions.length === 0){
                console.log("No hay dimensiones disponibles");
            }
    
            const dimensionChoices = dimensions.map(d => ({
                title: `${d.name} (${d.id})`,
                value: d
            }));
    
            const data = await prompts([
                {
                    type: 'text',
                    name: 'id',
                    message: 'Introduce el ID de la localización a modificar:',
                    validate: id => id.length > 0 ? true : "Debe de tener un ID"
                },
                {
                    type: 'text',
                    name: 'name',
                    message: 'Nuevo nombre (Enter para no modificar):',
                },
                {
                    type: 'text',
                    name: 'type',
                    message: 'Selecciona el nuevo tipo de la localización (Enter para no modificar):',
                },
                {
                    type: 'select',
                    name: 'dimension',
                    message: 'Selecciona la dimensión:',
                    choices: [{ title: 'No cambiar', value: null }, ...dimensionChoices]
                },
                {
                    type: 'number',
                    name: 'population',
                    message: 'Nueva población (Enter para no modificar):'
                },
                {
                    type: 'text',
                    name: 'desc',
                    message: 'Nueva escripción (Enter para no modificar):'
                }
            ]);

            /** Modifica la localizacion y validacion de error */
            try {
                const mod: any = {};
                if(data.name) mod.name = data.name;
                if(data.type) mod.type = data.type;
                if(data.dimension) mod.dimension = data.dimension;
                if(!isNaN(data.population)) mod.population = data.population;
                if(data.desc) mod.desc = data.desc;
    
                const res = await manager.localitations.modify(data.id, mod);
                console.log(`La localización ${data.id} ha sido modificada correctamente\n`);
            } catch (error: any) {
                console.log("Error", error.message);
            } 
        }

        /**
         * Prompt para buscar localizacion por el nombre
         * @param manager - Instancia del MultiverseManager que contiene todos los servicios
         */
        async function consutlByName(manager: MultiverseManager) {
            const data = await prompts([
                {
                    type: 'text',
                    name: 'name',
                    message: 'Introduce el nombre de la localización a consultar:',
                    validate: name => name.length > 0 ? true : "Debe de tener un nombre"
                }
            ]);

            /** Busca la localizacion, ya sea que la encuentre o no y validacion de error */
            try {
            const names: string = data.name;
    
            const res: Planets[] = await manager.localitations.consultLocationByName(names.trim());
    
            if(res.length == 0) {
                console.log('No se encontraron resultados');
            } else {
                console.log(`Se encontraron ${res.length} localizaciones con el nombre ${names}\n`);
                res.forEach((l: Planets, index: number) => {
                console.log(`${index + 1}. ${l.name} 
                             ID: ${l.id} 
                             Dimensión: ${l.dimension} 
                             Tipo: ${l.type} 
                             Población: ${l.population}
                             Descripción: ${l.desc}\n`);
                            });
            }
    
            } catch (error: any) {
                console.log("Error", error.message);
            }
        }

        /**
         * Prompt para buscar localizacion por el tipo
         * @param manager - Instancia del MultiverseManager que contiene todos los servicios
         */
        async function consutlByType(manager: MultiverseManager) {
            const data = await prompts([
                {
                    type: 'text',
                    name: 'type',
                    message: 'Introduce el tipo de la localización a consultar:',
                    validate: type => type.length > 0 ? true : "Debe de tener un tipo"
                }
            ]);

            /** Busca la localizacion, ya sea que la encuentre o no y validacion de error */
            try {
            const types: string = data.type;
    
            const res: Planets[] = await manager.localitations.consultLocationByType(types.trim());
    
            if(res.length == 0) {
                console.log('No se encontraron resultados');
            } else {
                console.log(`Se encontraron ${res.length} localizaciones con el tipo ${types}\n`);
                res.forEach((l: Planets, index: number) => {
                console.log(`${index + 1}. ${l.name} 
                             ID: ${l.id} 
                             Dimensión: ${l.dimension} 
                             Tipo: ${l.type} 
                             Población: ${l.population}
                             Descripción: ${l.desc}\n`);
                            });
            }
    
            } catch (error: any) {
                console.log("Error", error.message);
            }
        }

        /**
         * Prompt para buscar localizacion por la dimension
         * @param manager - Instancia del MultiverseManager que contiene todos los servicios
         */
        async function consultByDimension(manager: MultiverseManager) {
            const data = await prompts([
                {
                    type: 'text',
                    name: 'dimension',
                    message: 'Introduce el id de la dimensión a consultar:',
                    validate: dimension => dimension.length > 0 ? true : "Debe de tener una dimensión"
                }
            ]);

            /** Busca la localizacion, ya sea que la encuentre o no y validacion de error */
            try {
            const dimension: Dimensions = data.dimension;

            const res: Planets[] = await manager.localitations.consultLocationByDimension(dimension);

            if(res.length == 0) {
                    console.log('No se encontraron resultados');
                } else {
                    console.log(`Se encontraron ${res.length} localizaciones en la dimensión ${dimension}\n`);
                    res.forEach((l: Planets, index: number) => {
                    console.log(`${index + 1}. ${l.name} 
                                ID: ${l.id} 
                                Dimensión: ${l.dimension} 
                                Tipo: ${l.type} 
                                Población: ${l.population}
                                Descripción: ${l.desc}\n`);
                                });
                }

            } catch (error: any) {
                console.log("Error", error.message);
            }
        }
}