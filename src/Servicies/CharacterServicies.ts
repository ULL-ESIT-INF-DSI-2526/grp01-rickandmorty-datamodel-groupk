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
}