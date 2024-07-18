import axios from "axios"
import { getRecipeDataFromDefaultSchema } from "./general.js";

export async function getRecipeData(url: string) {

    try {
        const response = await axios.get(url);
        let html = response.data as string;

        let matches = html.match(/<script data-vmid="structured-data" type="application\/ld\+json">(.|\n)*?<\/script>/g)

        if(matches === null) return undefined;

        const parsedMatches: any[] = []

        matches?.forEach((match, index) => {
            parsedMatches.push(JSON.parse(match.replace('<script data-vmid="structured-data" type="application/ld+json">', '').replace('</script>', '')))
        })

        const recipeData = parsedMatches.find((match) => match['@type'] === 'Recipe')

        return getRecipeDataFromDefaultSchema(recipeData, url);
    
    } catch (error) {
        console.log(error);
        return undefined;
    }
}