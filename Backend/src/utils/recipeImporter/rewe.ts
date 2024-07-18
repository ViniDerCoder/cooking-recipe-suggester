import axios from "axios"
import { getRecipeDataFromDefaultSchema } from "./general.js";
import onReady from "../listener/ready.js";

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

        return getRecipeDataFromDefaultSchema(recipeData, url);
    
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

onReady("import test rewe", async () => {
console.log("Rewe")
console.log(await getRecipeData("https://www.rewe.de/rezepte/suesskartoffel-gnocchi-blattspinat-feta/"))
})