import { ObjectMenuOption } from "../Mainmenu.js"; 
import { DimensionState } from "../../Enums/DimensionState.js";

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