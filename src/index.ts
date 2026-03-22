import { db } from "./DataBase/db.js";
import { MultiverseManager } from "./Servicies/Multiverse.js";
import { dimensionsMenu } from "./Prompts/Menus/DimensionsMenu.js";
import { mainMenu } from "./Prompts/mainMenu.js";
import { charactersMenu } from "./Prompts/Menus/CharactersMenu.js";
import { localitationMenu } from "./Prompts/Menus/LocalitationMenu.js";
import { speciesMenu } from "./Prompts/Menus/SpeciesMenu.js";
import { inventsMenu } from "./Prompts/Menus/InventsMenu.js";
import { reportsMenu } from "./Prompts/Menus/ReportMenu.js";
import { eventsMenu } from "./Prompts/Menus/EventsMenu.js";

/**
 * Función principal para los menús que llama a los diferentes menús.
 */
async function main() {
    await db.read();

    /**
     * Inicializa el Multiverso con la base de datos.
     */
    const manager = new MultiverseManager(db);

    let exit = false;

    while(!exit) {
        /**
         * Llama a las opciones del menú principal
         */
        const option = await mainMenu();

        switch (option) {
            case 'dimensions':
                await dimensionsMenu(manager);
                break;

            case 'characters':
                await charactersMenu(manager);
                break;

            case 'localitations':
                await localitationMenu(manager);
                break;
            
            case 'species':
                await speciesMenu(manager);
                break;

            case 'invents':
                await inventsMenu(manager);
                break;

            case 'events': 
                await eventsMenu(manager);
                break;

            case 'reports':
                await reportsMenu(manager);
                break;
                
            case 'exit':
                exit = true;
                console.log("Saliendo del gestor...");
                break;
        }
    }
}

main();