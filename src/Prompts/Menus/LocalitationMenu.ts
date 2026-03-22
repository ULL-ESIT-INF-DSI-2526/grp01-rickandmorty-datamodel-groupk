import prompts from "prompts";

import { MultiverseManager } from "../../Servicies/Multiverse.js";
import { Planets } from "../../Class/Planets.js";
import { Dimensions } from "../../Class/Dimensions.js";

export async function localitationMenu(manager: MultiverseManager) {
    let back = false;
    
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
                    type: 'text',
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
    
        async function removeLocalitation(manager: MultiverseManager) {
            const {id} = await prompts({
                type: 'text',
                name: 'id',
                message: 'ID de la localización a eliminar',
                validate: id => id.length > 0 ? true : "Debe de tener un ID"
            });
    
            try {
                await manager.characters.remove(id);
                console.log(`La localización ${id} ha sido eliminada correctamente\n`)
            } catch (error: any) {
                console.log("Error", error.message);
            }
    
        }
    
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
                    type: 'text',
                    name: 'population',
                    message: 'Nueva población (Enter para no modificar):'
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
    
        async function consutlByName(manager: MultiverseManager) {
            const data = await prompts([
                {
                    type: 'text',
                    name: 'name',
                    message: 'Introduce el nombre de la localización a consultar:',
                    validate: name => name.length > 0 ? true : "Debe de tener un nombre"
                }
            ]);
            
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

        async function consutlByType(manager: MultiverseManager) {
            const data = await prompts([
                {
                    type: 'text',
                    name: 'type',
                    message: 'Introduce el tipo de la localización a consultar:',
                    validate: type => type.length > 0 ? true : "Debe de tener un tipo"
                }
            ]);
            
            try {
            const types: string = data.type;
    
            const res: Planets[] = await manager.localitations.consultLocationByName(types.trim());
    
            if(res.length == 0) {
                console.log('No se encontraron resultados');
            } else {
                console.log(`Se encontraron ${res.length} localizaciones con el tipo${types}\n`);
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