import { getRecipeData as getChefkochData } from "../../utils/recipeImporter/chefkoch.js";
import { getRecipeData as getReweData } from "../../utils/recipeImporter/rewe.js";
import { getRecipeData as getEssenUndTrinkenData } from "../../utils/recipeImporter/essen-und-trinken.js";

export const validRecipeUrls = [
    "chefkoch.de",
    "rewe.de",
    "essen-und-trinken.de"
]

export async function getRecipeData(url: unknown) {
    if(typeof url !== "string") return 'Invalid input';
    
    const decodedUrl = decodeURIComponent(url);
    if(url.includes("chefkoch.de")) return await getChefkochData(decodedUrl);
    if(url.includes("rewe.de")) return await getReweData(decodedUrl);
    if(url.includes("essen-und-trinken.de")) return await getEssenUndTrinkenData(decodedUrl);
}