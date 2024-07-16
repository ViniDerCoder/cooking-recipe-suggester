import axios from "axios"
import { getAllRecipeTypes } from "../../controller/recipes/recipeTypes.js";
import { getBestMatchingType, getIngredient, parseISODuration } from "./general.js";

export async function getRecipeData(url: string) {

    try {
        const response = await axios.get(url);
        let html = response.data as string;

        let matches = html.match(/<script type="application\/ld\+json" id="recipe-schema">(.|\n)*?<\/script>/g)

        if(matches === null) return undefined;

        const parsedMatches: any[] = []

        matches?.forEach((match, index) => {
            parsedMatches.push(JSON.parse(match.replace('<script type="application/ld+json" id="recipe-schema">', '').replace('</script>', '')))
        })

        const recipeData = parsedMatches.find((match) => match['@type'] === 'Recipe')

        return {
            name: recipeData.name,
            description: recipeData.description,
            instructions: recipeData.recipeInstructions.split('\n').map((instruction: string) => instruction.trim()).filter((instruction: string) => instruction.length > 0),
            cookingTime: parseISODuration(recipeData.cookTime),
            waitingTime: parseISODuration(recipeData.prepTime),
            servings: parseInt(recipeData.recipeYield),
            typeId: getBestMatchingType(recipeData.recipeCategory.split(',').map((category: string) => category.trim()), recipeData.keywords.split(',').map((keyword: string) => keyword.trim())),
            sourceUrl: url,
            imageUrl: recipeData.image[0],
            ingredients: recipeData.recipeIngredient.map((ingredient: string) => getIngredient(ingredient))
        };
    
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

console.log(await getRecipeData('https://www.chefkoch.de/rezepte/1170671223188552/Saftiges-Paprikagulasch.html'))