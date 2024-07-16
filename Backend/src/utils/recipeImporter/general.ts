import { getAllRecipeTypes } from "../../controller/recipes/recipeTypes.js";

export function getBestMatchingType(recipeCategorys: string[], keywords: string[]) {
    const types = getAllRecipeTypes();
    if(typeof types === "string") return undefined;

    //direct category match
    const type = types.find((type) => recipeCategorys.map((cat) => cat.toLowerCase()).includes(type.name.toLowerCase()));
    if(type) return type.id;

    //direct keyword match
    const keywordType = types.find((type) => keywords.map((keyword) => keyword.toLowerCase()).includes(type.name.toLowerCase()));
    if(keywordType) return keywordType.id;

    //no match found
    return types[0].id;
}

export function parseISODuration(duration: string) {
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

export function getIngredient(ingredient: string) {
    const [amount, unit, ...name] = ingredient.split(' ');
    return {
        amount: parseFloat(amount),
        unit: unit ? unit : undefined,
        name: name.join(' ')
    }
}