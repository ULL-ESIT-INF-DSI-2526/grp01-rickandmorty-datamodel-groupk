/** Falta comentar
 * Falta refactorizar para cumplir mejor los principios SOLID
 */

import { Character } from "../Class/Character.js";
import { Dimensions } from "../Class/Dimensions.js";
import { Species } from "../Class/Species.js";
/**
 * Clase para los servicios de los personajes
 */
export class CharacterServices {
    private characters: Character[];
    /**
     * Constructor de la clase sin parámetros
     */
    constructor() {
        this.characters = [];
    }
    /** 
     * Getter para los personajes
     */
    getAll(): Character[]{
        return this.characters;
    }
    /**
     * Método que añade un personaje al array
     * @param character - nuevo personaje a añadir
     */
    addCharacter(character: Character): void {
        this.characters.push(character);
    }
    /**
     * Método para eliminar un personaje por su id
     * @param id - id por el que filtramos el personaje
     * @returns - true o false, dependiendo de si el personaje se eliminó o no
     */
    removeCharacter(id: string): boolean {
        const before = this.characters.length;
        this.characters = this.characters.filter(c => c.id !== id);
        return this.characters.length < before;
    }
    /**
     * Método para modificar un personaje
     * @param id - identificador del personaje
     * @param name - nombre del personaje
     * @param species - especie del personaje
     * @param dimension - dimensión de la que proviene
     * @param afiliation - afiliación a la que pertenece
     * @param iq - nivel de inteligencia
     * @param desc - breve descripción del personaje
     * @returns - true o false, dependiendo de si el personaje se modificó o no
     */
    modifyCharacter(id: string, name?: string, species?: Species, dimension?: Dimensions, afiliation?: string, iq?: number, desc?: string): boolean {
        const character: Character | undefined = this.characters.find(c => c.id === id);
        
        if (!character) {
            return false;
        }

        if (name !== undefined) {
            character.name = name;
        }

        if (species !== undefined) {
            character.species = species;
        }

        if (dimension !== undefined) {
            character.dimension = dimension;
        }

        if (afiliation !== undefined) {
            character.afiliation = afiliation;
        }
        
        if (iq !== undefined) {
            character.iq = iq;
        }

        if (desc !== undefined) {
            character.desc = desc;
        }

        return true;
    }
    /**
     * Método para consultar personaje por su nombre
     * @param name - nombre del personaje
     * @param direction - dirección en la que ordenamos
     * @param sort - ordena el personaje
     * @returns - el personaje ordenado
     */
    consultCharacterByName(name: string, direction: boolean = false ,sort?: number): Character[] {
        const characters: Character[] = this.characters.filter(character => character.name === name);
        return this.applySorting(characters, direction, sort);
    }
    /**
     * Método para consultar personaje por su especie
     * @param specie - especie del personaje
     * @param direcction - dirección en la que ordenamos
     * @param sort - ordena el personaje
     * @returns - el personaje ordenado
     */
    consultCharacterBySpecies(specie: Species, direcction: boolean = false, sort?: number): Character[] {
        const characters: Character[] = this.characters.filter(character => character.species === specie);
        return this.applySorting(characters, direcction, sort);
    }
    /**
     * Método para consultar personaje por su afiliación
     * @param afiliation - aficiliación del personaje
     * @param direcction - dirección en la qu ordenamos
     * @param sort - ordena el personaje
     * @returns - el personaje ordenado
     */
    consultCharacterByAfilation(afiliation: string, direcction: boolean = false, sort?: number): Character[] {
        const characters: Character[] = this.characters.filter(character => character.afiliation === afiliation);
        return this.applySorting(characters, direcction, sort);
    }
    /**
     * Método para consultar un personaje por su estado
     * @param state - estado del personaje
     * @param direcction - dirección en la que ordenamos
     * @param sort - ordena el personaje
     * @returns - el personaje ordenado
     */
    consultCharacterByState(state: string, direcction: boolean = false, sort?: number): Character[] {
        const characters: Character[] = this.characters.filter(character => character.state === state);
        return this.applySorting(characters, direcction, sort);
    }
    /**
     * Método para consultar un personaje por su dimensión
     * @param dimension - dimensión del personaje
     * @param direcction - dirección en la que ordenamos
     * @param sort - ordena el personaje
     * @returns - personaje ordenado
     */
    consultCharacterByDimension(dimension: Dimensions, direcction: boolean = false, sort?: number): Character[] {
        const characters: Character[] = this.characters.filter(character => character.dimension === dimension);
        return this.applySorting(characters, direcction, sort);
    }
    /**
     * Método para ordenar los personajes
     * @param characters - array de personajes a ordenar
     * @param direcction - dirección en la que ordenamos
     * @param sort - ordena el personaje
     * @returns - personajes ordenados
     */
    private applySorting(characters: Character[], direcction: boolean, sort?: number): Character[] {
        if (sort === 1) {
            return this.sortByName(characters, direcction);
        }

        if (sort === 2) {
            return this.sortByIq(characters, direcction);
        }

        return characters;
    }
    /**
     * Método para ordenar personajes por nombre
     * @param characters - array de personajes a ordenar
     * @param direction - dirección en la que ordenamos
     * @returns - personajes ordenados
     */
    sortByName(characters: Character[], direction: boolean): Character[] {
        if (characters.length === 0) {
            return characters;
        }

        let names: string[] = [];
        for (const character of characters) {
            names.push(character.name);
        }

        names.sort();

        let sortCharacters: Character[] = [];
        let remainingCharacters: Character[] = [...characters]; // copia

        for (let i: number = 0; i < names.length; ++i) {
            const index = remainingCharacters.findIndex(c => c.name === names[i]);
            
            if (index !== -1) {
                sortCharacters.push(remainingCharacters[index]);
                remainingCharacters.splice(index, 1); 
            }
        }

        if (direction === false) {
            return sortCharacters;
        } else {
            return sortCharacters.reverse();
        }
    }

    /**
     * Método para ordenar personajes por su nivel de inteligencia
     * @param characters - array de personajes a ordenar
     * @param direcction - dirección en la que ordenamos
     * @returns - personajes ordenados
     */
    sortByIq(characters: Character[], direcction: boolean = false): Character[] {
        if (characters.length === 0) {
            return characters;
        }
        let iqs: number[] = [];
        for (const character of characters) {
            iqs.push(character.iq);
        }
        iqs.sort((a, b) => a - b);
        let sortCharacters: Character[] = [];
        let remainingCharacters: Character[] = [...characters]; // copia

        for (let i: number = 0; i < iqs.length; ++i) {
            const index = remainingCharacters.findIndex(c => c.iq === iqs[i]);
            
            if (index !== -1) {
                sortCharacters.push(remainingCharacters[index]);
                remainingCharacters.splice(index, 1); 
            }
        }
        if (direcction == false) {
            return sortCharacters;
        } else {
            return sortCharacters.reverse();
        }
    }
    /*
    sortByIq(direction: boolean = false): Character[] {
        return [...this.characters].sort((a, b) => direction ? b.iq - a.iq : a.iq - b.iq);
    }
    */

    
    /**
     * Localiza todas las versiones alternativas de un personaje por nombre.
     * @param name - nombre del personaje a buscar
     * @returns array de Character que coinciden con el nombre en distintas dimensiones
     */
    /*
    async findAllVersions(name: string): Promise<Character[]> {
        await this._db.read();
        return this._db.data.characters.filter(c => c.name === name);
    }
    */
}