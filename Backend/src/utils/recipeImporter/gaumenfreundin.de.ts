import axios from "axios"
import { getRecipeDataFromDefaultSchema } from "./general.js";

export async function getRecipeData(url: string) {

    try {
        const response = await axios.get(url);
        let html = response.data as string;

        let matches = html.match(/<script type="application\/ld\+json" class="yoast-schema-graph">(.|\n)*?<\/script>/g)

        if(matches === null) return undefined;

        const parsedMatches: any[] = []

        matches?.forEach((match, index) => {
            parsedMatches.push(JSON.parse(match.replace('<script type="application/ld+json" class="yoast-schema-graph">', '').replace('</script>', '')))
        })

        const recipeData = parsedMatches.find((match: any) => Array.isArray(match["@graph"]) && match["@graph"].find((subMatch: any) => subMatch["@type"] === "Recipe"))["@graph"].find((match: any) => match['@type'] === 'Recipe')

        return getRecipeDataFromDefaultSchema(recipeData, url);
    
    } catch (error) {
        console.log(error);
        return undefined;
    }
}