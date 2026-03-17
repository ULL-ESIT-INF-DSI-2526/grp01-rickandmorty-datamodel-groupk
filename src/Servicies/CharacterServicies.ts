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

    addCharacter(character: Character): boolean {
        if (this.characters.push(character)) {
            return true;
        }
        return false;
    }

    removeCharacter(id: string): boolean  {
        if (this.characters = this.characters.filter(c => c.id !== id)) {
            return true;
        }
        return false;       
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