import prompts from "prompts";

import { MultiverseManager } from "../../Servicies/Multiverse.js";
import { Character } from "../../Class/Character.js";
import { charactersMenu } from "./CharactersMenu.js";

/**
 * Función del menu principal de eventos
 * @param manager - Instancia del MultiverseManager que contiene todos los servicios
 */
export async function eventsMenu(manager: MultiverseManager) {
    let back = false;
    /** Bucle para elefir la opcion que se va a realizar */
    while(!back) {
        const res = await prompts({
            type: 'select',
            name: 'option',
            message: 'Menú de eventos',
            choices: [
                { title: 'Viajes Interdimensionales', value: 'travel' },
                { title: 'Anomalía en una dimensión', value: 'anomaly' },
                { title: 'Despliegue de un artefacto', value: 'deployment' },
                { title: 'Volver', value: 'back' }
            ]
        });

        // Selección de la opción a realizar
        switch (res.option) {
            case 'travel':
                await interdimentionalTravels(manager);
                break

            case 'anomaly':
                await dimensionAnomaly(manager);
                break;

            case 'deployment': 
                await artefactDeployment(manager);

            case 'back':
                back = true;
                break;
        }
    }

    async function interdimentionalTravels(manager: MultiverseManager) {
        /** Información necesaria para poder añadir al evento de viaje */
                const data = await prompts([
                    {
                        type: 'text',
                        name: 'character',
                        message: 'ID del personaje que hace el viaje interdimensional:',
                        validate: character => character.length > 0 ? true : "Debe de haber un personaje viajando"
                    },
                    {
                        type: 'text',
                        name: 'fromDim',
                        message: '¿Desde qué dimensión viaja?:',
                        validate: fromDim => fromDim.length > 0 ? true : "Debe de tener una razón"
                    },
                    {
                        type: 'text',
                        name: 'toDim',
                        message: '¿hasta qué dimensión viaja?:',
                        validate: toDim => toDim.length > 0 ? true : "Debe de tener una razón"
                    },
                    {
                        type: 'text',
                        name: 'reason',
                        message: 'Razón del viaje:',
                        validate: reason => reason.length > 0 ? true : "Debe de tener una razón"
                    }
                ]);
                
                /** Construye dimension y validación de error */
                try {
                    const char = data.character;
                    const from = data.fromDim;
                    const to = data.toDim;
                    
                    await manager.registerTravel(char, from, to, data.reason);
                    console.log(`El viaje del personaje con ID ${data.character} desde ${from} hasta ${to} ha sido registrado`);
        
                } catch (error: any) {
                    console.log("Error", error.message);
                }
            }

    async function dimensionAnomaly(manager: MultiverseManager) {
        /** Información necesaria para poder añadir al evento de viaje */
                const data = await prompts([
                    {
                        type: 'text',
                        name: 'dim',
                        message: 'Dimensión que sufre la anomalía:',
                        validate: dim => dim.length > 0 ? true : "Debe de haber una dimensión"
                    },
                    {
                        type: 'select',
                        name: 'destruction',
                        message: '¿Se crea o se desctruye?:',
                        choices: [
                            { title: "Creación", value: false },
                            { title: "Destrucción", value: true }
                        ]
                    },
                    {
                        type: 'select',
                        name: 'reason',
                        message: 'Razón de la reación:',
                        choices: [
                            { title: "Experimento", value: "A causa de un experimento" },
                            { title: "Paradoja", value: "A causa de una paradoja" }
                        ]
                    }
                ]);
                
                /** Construye dimension y validación de error */
                try {
                    
                    await manager.registerDimensionAnomaly(data.dim, data.destruction, data.reason);
                    if(data.destruction === true){
                        console.log(`La dimensión ${data.dim} ha sido destruida`);
                    } else {
                        console.log(`La dimensión ${data.dim} ha sido creada`);
                    }

                } catch (error: any) {
                    console.log("Error", error.message);
                }
            }

async function artefactDeployment(manager: MultiverseManager) {
        /** Información necesaria para poder añadir al evento de viaje */
                const data = await prompts([
                    {
                        type: 'text',
                        name: 'invent',
                        message: 'ID del invento:',
                        validate: invent => invent.length > 0 ? true : "Debe de haber un invento"
                    },
                    {
                        type: 'text',
                        name: 'loc',
                        message: '¿Dónde ha ocurrido?:',
                        validate: loc => loc.length > 0 ? true : "Debe de tener un lugar"
                    },
                    {
                        type: 'select',
                        name: 'deploy',
                        message: '¿Desplegado o neutralizado?:',
                        choices: [
                            { title: "neutralizado", value: false },
                            { title: "Desplegado", value: true }
                        ]
                    }
                ]);
                
                /** Construye dimension y validación de error */
                try {
    
                    await manager.registerArtifactDeployment(data.invent, data.loc, data.deploy);
                    if(data.deploy === true){
                        console.log(`El artefacto ${data.invent} ha sido desplegado`);
                    } else {
                        console.log(`El artefacto ${data.invent} ha sido neutralizado`);
                    }
        
                } catch (error: any) {
                    console.log("Error", error.message);
                }
            }
}