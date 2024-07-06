import onCleanup from "../../utils/listener/cleanup.js";
import query from "../../utils/query.js";
import { Ingredient, IngredientProperties } from "../../utils/types/ingredient.js";

let ingredientCache: {[id: string]: Ingredient} = {};
let lastFullCache = 0;

onCleanup('clearIngredientCache', 'MEMORY', async () => {
    ingredientCache = {};
    return true;
});

export async function getIngredientById(id: string) {
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
        id: result.rows[0].id,
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

export async function getAllIngredients() {
    if(Date.now() - lastFullCache < 1000 * 60 * 25) return Object.values(ingredientCache);

    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.ingredients';

    const result = await query(q, []);
    if(typeof result === "string") return 'Error getting all ingredients';

    const ingredients: Ingredient[] = [];
    result.rows.forEach((row) => {
        const ingredient = {
            id: row.id,
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
    lastFullCache = Date.now();
    return ingredients;
}
