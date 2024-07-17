import { getAllRecipeTypes } from "../../controller/recipes/recipeTypes.js";
import { FullRecipeIngredient } from "../types/ingredient.js";
import { Recipe, RecipeCreationData, RecipeImportData } from "../types/recipe.js";

export function getBestMatchingType(recipeCategorys: string[], keywords: string[]) {
    const types = getAllRecipeTypes();
    if(typeof types === "string") return undefined;

    //direct category match
    const type = types.find((type) => recipeCategorys.map((cat) => cat.toLowerCase()).includes(type.name.toLowerCase()));
    if(type) return type.id;

    //direct keyword match
    const keywordType = types.find((type) => keywords.map((keyword) => keyword.toLowerCase()).includes(type.name.toLowerCase()));
    if(keywordType) return keywordType.id;

    //no match found
    return types[0].id;
}

export function parseISODuration(duration: string) {
    const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?/;
    const matches = duration.match(regex);

    if (!matches) {
        return 1
    }

    const days = matches[1] ? parseInt(matches[1], 10) : 0;
    const hours = matches[2] ? parseInt(matches[2], 10) : 0;
    const minutes = matches[3] ? parseInt(matches[3], 10) : 0;

    return (days * 24 * 60) + (hours * 60) + (minutes);
}

export function getIngredient(ingredient: string) {
    const [amount, unit, ...name] = ingredient.split(' ');
    
    return undefined

    return {
        amount: parseFloat(amount),
        unit: unit ? unit : undefined,
        name: name.join(' ')
    } as FullRecipeIngredient;
}

export function getRecipeDataFromDefaultSchema(json: any, url: string) {
    return {
        name: json.name,
        description: json.description,
        instructions: Array.isArray(json.recipeInstructions) ? json.recipeInstructions : json.recipeInstructions.split('\n').map((instruction: string) => instruction.trim()).filter((instruction: string) => instruction.length > 0),
        cookingTime: parseISODuration(json.cookTime) || parseISODuration(json.totalTime),
        waitingTime: parseISODuration(json.prepTime),
        servings: parseInt(json.recipeYield),
        typeId: getBestMatchingType(Array.isArray(json.recipeCategory) ? json.recipeCategory : json.recipeCategory.split(",").map((cat: string) => cat.trim()), Array.isArray(json.keywords) ? json.keywords : json.keywords.split(",").map((keyword: string) => keyword.trim())),
        sourceUrl: url,
        imageUrl: Array.isArray(json.image) ? json.image[0] : json.image,
        ingredients: (json.recipeIngredient.map((ingredient: string) => getIngredient(ingredient))).filter((ingredient: any) => ingredient)
    } as RecipeImportData;
}