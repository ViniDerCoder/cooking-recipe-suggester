import axios from "axios"

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

        const recipeData = parsedMatches.find((match) => match['@type'] === 'Recipe')

        return recipeData;
    
    } catch (error) {
        console.log(error);
        return undefined;
    }
}