import { ObjectMenuOption } from "../Mainmenu.js"; 
import { DimensionState } from "../../Enums/DimensionState.js";
import { Dimensions } from "../../Class/Dimensions.js";

export type ObjectMenuChoice = {
    title: string;
    value: ObjectMenuOption;
};

export type DimensionMenuResponse = {
    action?: ObjectMenuOption;
};

export type IdPromptResponse = {
    id?: string;
};

export type NamePromptResponse = {
    name?: string;
};

export type StatePromptResponse = {
    state?: DimensionState;
};

export type StateOrKeepPromptResponse = {
    state?: DimensionState | "";
};

export type TechlevelNumberPromptResponse = {
    techlevel?: number;
};

export type TechlevelTextPromptResponse = {
    techlevel?: string;
};

export type DescPromptResponse = {
    desc?: string;
};

export type DimensionPatch = {
    name?: string;
    state?: DimensionState;
    techlevel?: number;
    desc?: string;
};

export interface IDimensionService {
    add(dimension: Dimensions): Promise<void>;
    remove(id: string): Promise<void>;
    modify(id: string, mod: DimensionPatch): Promise<boolean>;
}

export interface IDimensionPrompts {
    askDimensionMenuAction(): Promise<DimensionMenuResponse>;
    askDimensionId(message?: string): Promise<IdPromptResponse>;
    askDimensionName(message?: string): Promise<NamePromptResponse>;
    askDimensionState(message?: string): Promise<StatePromptResponse>;
    askDimensionStateOrKeep(): Promise<StateOrKeepPromptResponse>;
    askDimensionTechlevel(): Promise<TechlevelNumberPromptResponse>;
    askDimensionTechlevelOrKeep(): Promise<TechlevelTextPromptResponse>;
    askDimensionDescription(message?: string): Promise<DescPromptResponse>;
}

export interface ITextOutput {
    info(message: string): void;
    error(message: string): void;
}