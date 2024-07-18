import axios, { AxiosError } from "axios"
import { getRecipeDataFromDefaultSchema } from "./general.js";

export async function getRecipeData(url: string) {

    try {
        const response = await axios.get(url);
        let html = response.data as string;

        return extractData(html, url);

    } catch (error) {
        const er = error as AxiosError;
        console.log(er.code + " - " + er.message);
        return undefined;
    }
}

function extractData(html: string, url: string) {
    let matches = html.match(/<script type="application\/ld\+json" id="recipe-schema">(.|\n)*?<\/script>/g)

    if (matches === null) return undefined;

    const parsedMatches: any[] = []

    matches?.forEach((match, index) => {
        parsedMatches.push(JSON.parse(match.replace('<script type="application/ld+json" id="recipe-schema">', '').replace('</script>', '')))
    })

    const recipeData = parsedMatches.find((match) => match['@type'] === 'Recipe')

    return getRecipeDataFromDefaultSchema(recipeData, url);
}