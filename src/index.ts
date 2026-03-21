import { db } from "./DataBase/db.js";
import { MultiverseManager } from "./Servicies/Multiverse.js";
import { dimensionsMenu } from "./Prompts/Menus/DimensionsMenu.js";
import { mainMenu } from "./Prompts/mainMenu.js";
import { charactersMenu } from "./Prompts/Menus/CharactersMenu.js";
import { localitationMenu } from "./Prompts/Menus/LocalitationMenu.js";

async function main() {
    await db.read();

    const manager = new MultiverseManager(db);

    let exit = false;

    while(!exit) {
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
            
            case 'scpecies':
                await speciesMenu(manager);
                break;

            case 'exit':
                exit = true;
                console.log("Saliendo del gestor...");
                break;
        }
    }
}

main();