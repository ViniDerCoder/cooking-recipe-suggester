import axios from "axios"
import { getAllRecipeTypes } from "../../controller/recipes/recipeTypes.js";

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

        return {
            name: recipeData.name,
            description: recipeData.description,
            instructions: recipeData.recipeInstructions.split('\n').map((instruction: string) => instruction.trim()).filter((instruction: string) => instruction.length > 0),
            cookingTime: parseISODuration(recipeData.cookTime),
            waitingTime: parseISODuration(recipeData.prepTime),
            servings: parseInt(recipeData.recipeYield),
            typeId: getBestMatchingType(recipeData.recipeCategory, recipeData.keywords),
            sourceUrl: url,
            imageUrl: recipeData.image,
            ingredients: recipeData.recipeIngredient.map((ingredient: string) => getIngredient(ingredient))
        };
    
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

function getIngredient(ingredient: string) {
    const [amount, unit, ...name] = ingredient.split(' ');
    return {
        amount: parseFloat(amount),
        unit: unit ? unit : undefined,
        name: name.join(' ')
    }
}

function getBestMatchingType(recipeCategory: string, keywords: string[]) {
    const types = getAllRecipeTypes();
    if(typeof types === "string") return undefined;

    //direct category match
    const type = types.find((type) => type.name.toLowerCase() === recipeCategory.toLowerCase());
    if(type) return type.id;

    //direct keyword match
    const keywordType = types.find((type) => keywords.map((keyword) => keyword.toLowerCase()).includes(type.name.toLowerCase()));
    if(keywordType) return keywordType.id;

    //no match found
    return types[0].id;
}

function parseISODuration(duration: string) {
    const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?/;
    const matches = duration.match(regex);

    if (!matches) {
        return 1
    }

    const days = matches[1] ? parseInt(matches[1], 10) : 0;
    const hours = matches[2] ? parseInt(matches[2], 10) : 0;
    const minutes = matches[3] ? parseInt(matches[3], 10) : 0;

    return (days * 24 * 60) + (hours * 60) + (minutes);
}

// Example usage:
const duration = "P0DT0H30M";
const parsedDuration = parseISODuration(duration);
console.log(parsedDuration); // Output: { days: 0, hours: 0, minutes: 30 }

console.log(await getRecipeData('https://www.chefkoch.de/rezepte/1170671223188552/Saftiges-Paprikagulasch.html'))