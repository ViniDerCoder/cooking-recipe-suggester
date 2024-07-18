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

        const recipeData = parsedMatches.find((match) => Array.isArray(match) && match.find((subMatch) => subMatch['@type'] === 'Recipe'))

        return getRecipeDataFromDefaultSchema(recipeData.find((match: any) => match['@type'] === 'Recipe'), url);
    
    } catch (error) {
        console.log(error);
        return undefined;
    }
}
onReady("import test essen und trinken", async () => {
console.log("Essen und Trinken")
console.log(await getRecipeData("https://www.essen-und-trinken.de/rezepte/spaghetti-alla-chitarra-mit-tomaten-und-brokkoli-rezept-13544448.html"))
})