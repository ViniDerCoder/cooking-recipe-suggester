import { getRecipeData as getChefkochData } from "../../utils/recipeImporter/chefkoch.js";
import { getRecipeData as getReweData } from "../../utils/recipeImporter/rewe.js";
import { getRecipeData as getEssenUndTrinkenData } from "../../utils/recipeImporter/essen-und-trinken.js";

export const validRecipeUrls = [
    "chefkoch.de",
    "rewe.de",
    "essen-und-trinken.de"
]

export async function getRecipeData(url: string) {
    if(url.includes("chefkoch.de")) return await getChefkochData(url);
    if(url.includes("rewe.de")) return await getReweData(url);
    if(url.includes("essen-und-trinken.de")) return await getEssenUndTrinkenData(url);
}