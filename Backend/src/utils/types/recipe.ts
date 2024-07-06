import { isUuid, Uuid } from "./other.js";


export type Recipe = {
    id: Uuid,
    name: string,
    description: string,
    instructions: Array<string>,
    createdAt: Date,
    createdById: Uuid,
    cookingTime: number,
    waitingTime: number,
    servings: number,
    public: boolean,
    typeId: Uuid,
    sourceUrl: string | null | undefined,
    imageUrl: string | null | undefined
}

export function isRecipe(any: any): any is Recipe {
    if(typeof any !== "object" || !any) return false;

    if(!isUuid(any.id)) return false;
    if(typeof any.name !== "string") return false;
    if(typeof any.description !== "string") return false;
    if(!Array.isArray(any.instructions)) return false;
    if(!any.instructions.every((instr: any) => typeof instr === "string")) return false;
    if(any.instructions.length < 1) return false;
    if(!(any.createdAt instanceof Date)) return false;
    if(!isUuid(any.createdById)) return false;
    if(typeof any.cookingTime !== "number") return false;
    if(typeof any.waitingTime !== "number") return false;
    if(typeof any.servings !== "number") return false;
    if(typeof any.public !== "boolean") return false;
    if(!isUuid(any.typeId)) return false;
    if(typeof any.sourceUrl !== "string" && any.sourceUrl !== null && any.sourceUrl !== undefined) return false;
    if(typeof any.imageUrl !== "string" && any.imageUrl !== null && any.imageUrl !== undefined) return false;

    return true;
}


export type RecipeCreationData = {
    name: string,
    description: string,
    instructions: Array<string>,
    cookingTime: number,
    waitingTime: number,
    servings: number,
    typeId: Uuid,
    imageUrl: string | null | undefined
}

export function isRecipeCreationData(any: any): any is RecipeCreationData {
    if(typeof any !== "object" || !any) return false;

    if(typeof any.name !== "string") return false;
    if(typeof any.description !== "string") return false;
    if(!Array.isArray(any.instructions)) return false;
    if(!any.instructions.every((instr: any) => typeof instr === "string")) return false;
    if(typeof any.cookingTime !== "number") return false;
    if(typeof any.waitingTime !== "number") return false;
    if(typeof any.servings !== "number") return false;
    if(!isUuid(any.typeId)) return false;
    if(typeof any.imageUrl !== "string" && any.imageUrl !== null && any.imageUrl !== undefined) return false;

    return true;
}


export type RecipeType = {
    id: Uuid,
    name: string
}

export function isRecipeType(any: any): any is RecipeType {
    if(typeof any !== "object" || !any) return false;

    if(!isUuid(any.id)) return false;
    if(typeof any.name !== "string") return false;

    return true;
}


export type RecipeUserData = {
    recipeId: Uuid,
    userId: Uuid,
    rating: number | null | undefined,
    notes: string | null | undefined,
    cooked: Array<Date>,
    recipeDeletedName: string | null | undefined
}

export function isRecipeUserData(any: any): any is RecipeUserData {
    if(typeof any !== "object" || !any) return false;

    if(!isUuid(any.recipeId)) return false;
    if(!isUuid(any.userId)) return false;
    if(typeof any.rating !== "number" && any.rating !== null && any.rating !== undefined) return false;
    if(typeof any.notes !== "string" && any.notes !== null && any.notes !== undefined) return false;
    if(!Array.isArray(any.cooked)) return false;
    if(!any.cooked.every((date: any) => date instanceof Date)) return false;
    if(typeof any.recipeDeletedName !== "string" && any.recipeDeletedName !== null && any.recipeDeletedName !== undefined) return false;

    return true;
}


export const editabelRecipeProperties = ["name", "description", "instructions", "cookingTime", "waitingTime", "servings", "public", "typeId", "imageUrl"] as const
export type EditableRecipePropertie = typeof editabelRecipeProperties[number]

export function isEditableRecipePropertie(any: any): any is EditableRecipePropertie {
    if(!editabelRecipeProperties.includes(any)) return false;

    return true;
}