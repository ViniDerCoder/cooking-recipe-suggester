import stringSimilarity from 'string-similarity';

import { getAllRecipeTypes } from "../../controller/recipes/recipeTypes.js";
import { getAllIngredients } from "../../database/ingredients/get.js";
import { FullRecipeIngredient, RecipeIngredientUnit } from "../types/ingredient.js";
import { Recipe, RecipeCreationData, RecipeImportData } from "../types/recipe.js";

export function getBestMatchingType(recipeCategorys: string[], keywords: string[]) {
    const types = getAllRecipeTypes();
    if (typeof types === "string") return undefined;

    //direct category match
    if (recipeCategorys && Array.isArray(recipeCategorys)) {
        const type = types.find((type) => recipeCategorys.map((cat) => cat.toLowerCase()).includes(type.name.toLowerCase()));
        if (type) return type.id;
    }

    //direct keyword match
    if (keywords && Array.isArray(keywords)) {
        const keywordType = types.find((type) => keywords.map((keyword) => keyword.toLowerCase()).includes(type.name.toLowerCase()));
        if (keywordType) return keywordType.id;
    }

    //no match found
    return types[0].id;
}

export function parseISODuration(duration: string) {
    if (!duration) return undefined;
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

export async function getIngredient(ingredient: string) {
    const parsedIngredient = parseIngredientInfo(ingredient);
    const ingredients = await getAllIngredients();
    if (typeof ingredients === "string") return undefined;

    const bestMatch = stringSimilarity.findBestMatch(parsedIngredient.name, ingredients.map((ingr) => ingr.name.toLowerCase()));

    if (bestMatch.bestMatch.rating > 0.6) {
        return {
            id: ingredients[bestMatch.bestMatchIndex].id,
            properties: ingredients[bestMatch.bestMatchIndex].properties,
            name: ingredients[bestMatch.bestMatchIndex].name,

            amount: parsedIngredient.amount,
            unit: parsedIngredient.unit,
            description: parsedIngredient.description
        } as FullRecipeIngredient;
    }

    return undefined
}

const unitDict: { [key: string]: RecipeIngredientUnit } = {
    "g": "gram",
    "kg": "kilogram",
    "ml": "milliliter",
    "l": "liter",
    "tsp": "teaspoon",
    "tbsp": "tablespoon",
    "tasse": "cup",
    "el": "tablespoon",
    "tl": "teaspoon",
    "prise": "pinch",
    "große": "big",
    "großes": "big",
    "großer": "big",
    "großen": "big",
    "kleine": "small",
    "kleines": "small",
    "kleiner": "small",
    "kleinen": "small"
}


function parseIngredientInfo(ingredient: string) {
    const amount = ingredient.split(' ')[0].toLowerCase().replace(',', '.');
    if (Number.isNaN(parseFloat(amount))) {
        if (ingredient.split(' ').length === 1) {
            return { amount: 1, unit: undefined as RecipeIngredientUnit, name: ingredient.toLowerCase().trim(), description: undefined };
        } else {
            const unit = ingredient.split(' ')[0].toLowerCase();
            if (unitDict[unit]) {
                return {
                    amount: 1 as number,
                    unit: unitDict[unit] as RecipeIngredientUnit,
                    name: ingredient.split(' ').slice(1).join(' ').split(',')[0].toLowerCase().trim(),
                    description: ingredient.split(' ').slice(1).join(' ').split(',').slice(1).join(',').toLowerCase().trim()
                };
            } else {
                return {
                    amount: 1 as number,
                    unit: undefined as RecipeIngredientUnit,
                    name: ingredient.split(',')[0].toLowerCase().trim(),
                    description: ingredient.split(',').slice(1).join(',').toLowerCase().trim()
                };
            }
        }
    } else {
        const unit = ingredient.split(' ')[1].toLowerCase();
        const ingr = amount.includes(',') ? ingredient.replace(",", "") : ingredient
        if (unitDict[unit]) {
            return {
                amount: parseFloat(amount),
                unit: unitDict[unit] as RecipeIngredientUnit,
                name: ingr.split(' ').slice(2).join(' ').split(',')[0].toLowerCase().trim(),
                description: ingr.split(' ').slice(2).join(' ').split(',').slice(1).join(',').toLowerCase().trim()
            };
        } else {
            return {
                amount: parseFloat(amount),
                unit: undefined as RecipeIngredientUnit,
                name: ingr.split(' ').slice(1).join(' ').split(',')[0].toLowerCase().trim(),
                description: ingr.split(' ').slice(1).join(' ').split(',').slice(1).join(',').toLowerCase().trim()
            };
        }

    }
}

export async function getRecipeDataFromDefaultSchema(json: any, url: string) {

    if (!json || typeof json !== "object") return undefined;

    return {
        name: json.name,
        description: json.description,
        instructions: json.recipeInstructions ? (Array.isArray(json.recipeInstructions) ? (typeof json.recipeInstructions[0] === "object" && json.recipeInstructions[0] ? json.recipeInstructions.map((instr: any) => instr.text) : json.recipeInstructions) : json.recipeInstructions.split('\n').map((instruction: string) => instruction.trim()).filter((instruction: string) => instruction.length > 0)) : [],
        cookingTime: parseISODuration(json.cookTime) || parseISODuration(json.totalTime),
        waitingTime: parseISODuration(json.prepTime),
        servings: json.recipeYield ? parseInt(Array.isArray(json.recipeYield) ? json.recipeYield[0] : json.recipeYield, 10) : 1,
        typeId: getBestMatchingType(json.recipeCategory ? (Array.isArray(json.recipeCategory) ? json.recipeCategory : json.recipeCategory.split(",").map((cat: string) => cat.trim())) : undefined, json.keywords ? (Array.isArray(json.keywords) ? json.keywords : json.keywords.split(",").map((keyword: string) => keyword.trim())) : undefined),
        sourceUrl: url,
        imageUrl: json.image ? (Array.isArray(json.image) ? (typeof json.image[0] === "object" && json.image[0] ? json.image[0].url : json.image[0]) : (typeof json.image === "object" && json.image ? json.image.url : json.image)) : undefined,
        ingredients: json.recipeIngredient ? ((await Promise.all(json.recipeIngredient.map((ingredient: string) => getIngredient(ingredient)))).filter((ingredient: any) => ingredient)) : undefined
    } as RecipeImportData;
}