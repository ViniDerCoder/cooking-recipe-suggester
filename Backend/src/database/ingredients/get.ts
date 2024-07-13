import onCleanup from "../../utils/listener/cleanup.js";
import query from "../../utils/query.js";
import { Ingredient, IngredientProperties } from "../../utils/types/ingredient.js";
import { Uuid } from "../../utils/types/other.js";

let ingredientCache: {[id: Uuid]: Ingredient} = {};
let lastFullCache = 0;

onCleanup('clearIngredientCache', 'MEMORY', async () => {
    ingredientCache = {};
    return true;
});

export async function getIngredientById(id: Uuid) {
    if(ingredientCache[id]) return ingredientCache[id];
    const params = [id];

    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.ingredients '
    + 'WHERE id = ?';

    const result = await query(q, params);
    if(typeof result === "string") return 'Error getting ingredient by id';
    if(result.rows.length === 0) return 'Ingredient not found';
    const ingredient = {
        id: result.rows[0].id.toString('hex'),
        name: result.rows[0].name,
        properties: {
            vegan: result.rows[0].vegan,
            vegetarian: result.rows[0].vegetarian,
            glutenFree: result.rows[0].gluten_free,
            dairyFree: result.rows[0].dairy_free,
            nutFree: result.rows[0].nut_free,
            eggFree: result.rows[0].egg_free,
            fishFree: result.rows[0].fish_free,
            shellfishFree: result.rows[0].shellfish_free,
            soyFree: result.rows[0].soy_free
        } as IngredientProperties
    } as Ingredient;
    ingredientCache[id] = ingredient;
    return ingredient;
}

export async function getIngredientsByIds(ids: Uuid[]) {
    if(ids.length === 0) return [];
    if(ids.every((id) => ingredientCache[id])) return ids.map((id) => ingredientCache[id]);
    const params = [ids];

    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.ingredients '
    + 'WHERE id IN ?';

    const result = await query(q, params);
    if(typeof result === "string") return 'Error getting ingredients by ids';
    if(result.rows.length === 0) return 'Ingredients not found';
    const ingredients = result.rows.map((row) => {
        return {
            id: row.id.toString('hex'),
            name: row.name,
            properties: {
                vegan: row.vegan,
                vegetarian: row.vegetarian,
                glutenFree: row.gluten_free,
                dairyFree: row.dairy_free,
                nutFree: row.nut_free,
                eggFree: row.egg_free,
                fishFree: row.fish_free,
                shellfishFree: row.shellfish_free,
                soyFree: row.soy_free
            } as IngredientProperties
        } as Ingredient;
    })
    ingredients.forEach((ingredient) => ingredientCache[ingredient.id] = ingredient);
    return ingredients;
}

export async function getAllIngredients(limit?: number) {
    if(Date.now() - lastFullCache < 1000 * 60 * 25) return Object.values(ingredientCache).slice(undefined, limit);

    const params = typeof limit === "number" ? [limit] : [];
    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.ingredients'
    + (typeof limit === "number" ? ' LIMIT ?' : '');

    const result = await query(q, params);
    if(typeof result === "string") return 'Error getting all ingredients';

    const ingredients: Ingredient[] = [];
    result.rows.forEach((row) => {
        const ingredient = {
            id: row.id.toString('hex'),
            name: row.name,
            properties: {
                vegan: row.vegan,
                vegetarian: row.vegetarian,
                glutenFree: row.gluten_free,
                dairyFree: row.dairy_free,
                nutFree: row.nut_free,
                eggFree: row.egg_free,
                fishFree: row.fish_free,
                shellfishFree: row.shellfish_free,
                soyFree: row.soy_free
            } as IngredientProperties
        } as Ingredient;
        ingredients.push(ingredient);
        ingredientCache[row.id] = ingredient;
    });
    if(typeof limit !== "number") lastFullCache = Date.now();
    return ingredients;
}
