import axios from "axios"
import { getRecipeDataFromDefaultSchema } from "./general.js";
import onReady from "../listener/ready.js";

export async function getRecipeData(url: string) {

    try {
        const response = await axios.get(url);
        let html = response.data as string;

        let matches = html.match(/<script type="application\/ld\+json">(.|\n)*?<\/script>/g)

        if(matches === null) return undefined;

        const parsedMatches: any[] = []

        matches?.forEach((match, index) => {
            parsedMatches.push(JSON.parse(match.replace('<script type="application/ld+json">', '').replace('</script>', '')))
        })

        const recipeData = parsedMatches.find((match) => match['@type'] === 'Recipe')

        return getRecipeDataFromDefaultSchema(recipeData, url);
    
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

onReady("import test chefkoch", async () => {
    console.log("Chefkoch")
    console.log(await getRecipeData("https://www.chefkoch.de/rezepte/1735501282565789/Der-weltbeste-Schokoladen-Blechkuchen.html"))
})