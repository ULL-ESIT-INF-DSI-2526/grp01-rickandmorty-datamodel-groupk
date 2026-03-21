import { Low } from "lowdb";
import { Data } from "../DataBase/db.js";

import { LocationServices } from "./LocationServicies.js";
import { DimensionServices } from "./DimensionServices.js";
import { InventServices } from "./InventServices.js";
import { CharacterServices } from "./CharacterServicies.js";
import { SpeciesServices } from "./SpeciesServices.js";

export class MultiverseManager {
    private _db: Low<Data>;
    public dimensions: DimensionServices;
    public characters: CharacterServices; //Descomentar cuando esté completa la clase CharacterServices
    public localitations: LocationServices;
    public invents: InventServices;
    public species: SpeciesServices;

    /**
     * El constructor toma la base de datos como parámetro y la usa para inicializar los "Services",
     * de esta forma el gestor tiene acceso a todo el multiverso
     * @param dataBase - Base de datos
     */
    constructor(dataBase: Low<Data>) {
        this._db = dataBase;
        this.dimensions = new DimensionServices(dataBase);
        this.characters = new CharacterServices(dataBase); //Descomentar cuando esté completa la clase CharacterServices
        this.localitations = new LocationServices(dataBase);
        this.invents = new InventServices(dataBase);
        this.species = new SpeciesServices(dataBase);
    }

    /*
    Aquí hay que poner las funciones que se piden para el gestor en el guión
    */
}