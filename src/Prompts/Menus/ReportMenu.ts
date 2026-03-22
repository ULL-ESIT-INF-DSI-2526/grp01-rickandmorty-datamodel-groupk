import prompts from "prompts";
import { MultiverseManager } from "../../Servicies/Multiverse.js"; 

/**
 * Menú interactivo para consultar los informes del Multiverso
 * @param manager - Instancia del gestor global
 */
export async function reportsMenu(manager: MultiverseManager) {
    let back = false;

    while (!back) {
        console.log("\n========================================");
        console.log("INFORMES DEL MULTIVERSO");
        console.log("========================================\n");

        const res = await prompts({
            type: 'select',
            name: 'option',
            message: '¿Qué informe deseas consultar?',
            choices: [
                { title: '1. Dimensiones activas y Nivel Tecnológico Medio', value: 'active_dims' },
                { title: '2. Personajes con más versiones alternativas', value: 'alt_versions' },
                { title: '3. Inventos más peligrosos desplegados', value: 'danger_invents' },
                { title: '4. Historial de viajes de un personaje', value: 'travel_history' },
                { title: '5. Detectar personajes huérfanos (Alerta de Estado)', value: 'orphans' },
                { title: 'Volver al menú principal', value: 'back' }
            ]
        });
        if (!res.option) return;

        switch (res.option) {
            case 'active_dims': {
                const report1 = await manager.getActiveDimensionsReport();
                console.log(`\nNivel Tecnológico Medio del Multiverso Activo: ${report1.averageTechLevel.toFixed(2)}`);
                if (report1.activeDimensions.length > 0) {
                    console.table(report1.activeDimensions, ["id", "name", "techlevel", "description"]);
                } else {
                    console.log("No hay dimensiones activas en este momento.");
                }
                break;
            }

            case 'alt_versions': {
                const report2 = await manager.getCharactersWithMostVersions();
                console.log("\nPersonajes con múltiples versiones en el Multiverso:");
                if (report2.length > 0) {
                    console.table(report2);
                } else {
                    console.log("No se han detectado versiones alternativas del mismo personaje.");
                }
                break;
            }

            case 'danger_invents': {
                const report3 = await manager.getMostDangerousDeployedArtifacts();
                console.log("\nInventos más peligrosos actualmente desplegados:");
                if (report3.length > 0) {
                    const displayData = report3.map(r => ({
                        ID_Invento: r.invent.id,
                        Nombre: r.invent.name,
                        Nivel_Peligro: r.invent.dangerLevel,
                        ID_Localizacion: r.locationId
                    }));
                    console.table(displayData);
                } else {
                    console.log("El multiverso es seguro. No hay inventos peligrosos desplegados.");
                }
                break;
            }

            case 'travel_history': {
                const inputRes = await prompts({
                    type: 'text',
                    name: 'charId',
                    message: 'Introduce el ID del personaje para ver su historial (ej. C-01):'
                });

                if (!inputRes.charId) break;

                const history = await manager.getCharacterTravelHistory(inputRes.charId);
                
                console.log(`\nHistorial de viajes para el personaje [${inputRes.charId}]:`);
                if (history.length > 0) {
                    const displayHistory = history.map(h => ({
                        Fecha: new Date(h.date).toLocaleString(),
                        Desde: h.payload.fromDimId,
                        Hacia: h.payload.toDimId,
                        Motivo: h.description
                    }));
                    console.table(displayHistory);
                } else {
                    console.log("Este personaje no ha realizado viajes interdimensionales o el ID no existe.");
                }
                break;
            }

            case 'orphans': {
                const orphans = await manager.checkOrphanCharacters();
                console.log("\nAlerta: Personajes sin dimensión de origen o dimensión destruida:");
                if (orphans.length > 0) {
                    console.table(orphans, ["id", "name", "status"]);
                } else {
                    console.log("Todos los personajes tienen su dimensión de origen intacta.");
                }
                break;
            }

            case 'back':
                back = true;
                break;
        }
    }
}