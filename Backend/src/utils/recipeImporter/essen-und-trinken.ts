import axios from "axios"
import { getBestMatchingType, getIngredient, parseISODuration } from "./general.js";

export async function getRecipeData(url: string) {

    try {
        const response = await axios.get(url);
        let html = response.data as string;

        html = html.replace(/<style.*?>.*?<\/style>/g, '');
        html = html.replace(/<div.*?>.*?<\/div>/g, '');

        let matches = html.match(/<script type="application\/ld\+json">(.|\n)*?<\/script>/g)

        if(matches === null) return undefined;

        const parsedMatches: any[] = []

        matches?.forEach((match, index) => {
            parsedMatches.push(JSON.parse(match.replace('<script type="application/ld+json">', '').replace('</script>', '')))
        })

        const recipeData = parsedMatches.find((match) => "name" in match)

        return {
            name: recipeData.name,
            description: recipeData.description,
            instructions: recipeData.recipeInstructions,
            cookingTime: parseISODuration(recipeData.totalTime),
            waitingTime: 0,
            servings: parseInt(recipeData.recipeYield),
            typeId: undefined,
            sourceUrl: url,
            imageUrl: recipeData.image[0],
            ingredients: recipeData.recipeIngredient.map((ingredient: string) => getIngredient(ingredient))
        };
    
    } catch (error) {
        console.log(error);
        return undefined;
    }
}