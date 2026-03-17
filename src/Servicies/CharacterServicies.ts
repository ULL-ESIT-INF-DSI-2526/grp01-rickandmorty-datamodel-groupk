import { Character } from "../Class/Character";
import { Dimensions } from "../Class/Dimensions";
import { Species } from "../Class/Species";

export class CharacterServices {
    private characters: Character[];

    constructor() {
        this.characters = [];
    }

    getAll(): Character[]{
        return this.characters;
    }

    addCharacter(character: Character): void {
        this.characters.push(character);
    }

    removeCharacter(id: string): boolean {
        const before = this.characters.length;
        this.characters = this.characters.filter(c => c.id !== id);
        return this.characters.length < before;
    }

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

    consultCharacterByName(name: string, direcction: boolean ,sort?: number): Character[] {
        let characters: Character[] = this.characters.filter(character => character.name === name);
        if (sort == 1) {
            return this.sortByName(characters);
        } else if (sort == 2) {
            return this.sortByName(characters);
        } else {
            return characters;
        }
    }

    consultCharacterBySpecies(specie: Species): Character[] {
        return this.characters.filter(character => character.species === specie);
    }

    consultCharacterByAfilation(afiliation: string): Character[] {
        return this.characters.filter(character => character.afiliation === afiliation);
    }

    consultCharacterByState(state: string): Character[] {
        return this.characters.filter(character => character.state === state);
    }

    consultCharacterByDimension(dimension: Dimensions): Character[] {
        return this.characters.filter(character => character.dimension === dimension);
    }

    sortByName(characters: Character[]): Character[] {
        if (characters.length === 0) {
            return characters;
        }
        let names: string[] = [];
        for (let name of Character.name) {
            names.push(name);
        }
        names.sort();
        let sortCharacters: Character[] = [];
        // Mirara lo de undifiened
        for(let i: number = 0; i < names.length; ++i) {
            const character: Character = characters.find(c => c.name === names[i])!;
            sortCharacters.push(character);
        }
        return sortCharacters;
    }
}