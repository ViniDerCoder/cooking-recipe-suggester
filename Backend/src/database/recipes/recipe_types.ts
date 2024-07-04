import onReady from "../../utils/listener/ready.js";
import query from "../../utils/query.js";

let recipeTypes: {[id: string]: string} = {};

onReady('cacheAllRecipeTypes', async () => { await cacheAllRecipeTypes() });

export async function cacheAllRecipeTypes() {
    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.recipe_types';

    const result = await query(q, []);
    if(typeof result === "string") return 'Error caching recipe types';
    else {
        result.rows.forEach((row) => {
            recipeTypes[row.id] = row.name;
        });
    }
}

export function getRecipeTypeById(id: string) {
    return recipeTypes[id];
}

export function getAllRecipeTypes() {
    return Object.keys(recipeTypes).map((id) => {
        return {
            id: id,
            name: recipeTypes[id]
        };
    });
}