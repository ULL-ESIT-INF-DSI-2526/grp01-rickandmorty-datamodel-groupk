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

    consultCharacterByName(name: string, direcction: boolean = false ,sort?: number): Character[] {
        const characters: Character[] = this.characters.filter(character => character.name === name);
        return this.applySorting(characters, direcction, sort);
    }

    consultCharacterBySpecies(specie: Species, direcction: boolean = false, sort?: number): Character[] {
        const characters: Character[] = this.characters.filter(character => character.species === specie);
        return this.applySorting(characters, direcction, sort);
    }

    consultCharacterByAfilation(afiliation: string, direcction: boolean = false, sort?: number): Character[] {
        const characters: Character[] = this.characters.filter(character => character.afiliation === afiliation);
        return this.applySorting(characters, direcction, sort);
    }

    consultCharacterByState(state: string, direcction: boolean = false, sort?: number): Character[] {
        const characters: Character[] = this.characters.filter(character => character.state === state);
        return this.applySorting(characters, direcction, sort);
    }

    consultCharacterByDimension(dimension: Dimensions, direcction: boolean = false, sort?: number): Character[] {
        const characters: Character[] = this.characters.filter(character => character.dimension === dimension);
        return this.applySorting(characters, direcction, sort);
    }

    private applySorting(characters: Character[], direcction: boolean, sort?: number): Character[] {
        if (sort === 1) {
            return this.sortByName(characters, direcction);
        }

        if (sort === 2) {
            return this.sortByIq(characters, direcction);
        }

        return characters;
    }

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

    sortByIq(characters: Character[], direcction: boolean = false): Character[] {
        if (characters.length === 0) {
            return characters;
        }
        let iqs: number[] = [];
        for (const character of characters) {
            iqs.push(character.iq);
        }
        iqs.sort();
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
}