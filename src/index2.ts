import { db } from "./DataBase/db.js";
import { MultiverseManager } from "./Servicies/Multiverse.js";
import { dimensionsMenu } from "./Prompsts/Menus/DimensionsMenu.js";
import { mainMenu } from "./Prompsts/Mainmenu.js";

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
            case 'exit':
                exit = true;
                console.log("Saliendo del gestor...");
                break;
        }
    }
}

main();