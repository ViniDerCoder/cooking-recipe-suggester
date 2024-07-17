import query from "../../utils/query.js";
import { IngredientRecipeData } from "../../utils/types/ingredient.js";
import { Uuid } from "../../utils/types/other.js";

export async function getIngredientsOfRecipe(recipeId: Uuid) {
    const params = [recipeId];
    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.recipe_ingredients '
    + 'WHERE recipe_id = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error getting ingredients of recipe';
    else return result.rows.map((row) => {
        return {
            id: row.ingredient_id.toString('hex'),
            amount: row.quantity,
            unit: row.unit ? row.unit : null,
            description: row.description ? row.description : null
        } as IngredientRecipeData;
    });
}

export async function getIngredientsOfRecipes(recipeIds: Uuid[]) {
    if(recipeIds.length === 0) return [];
    const params = [recipeIds];
    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.recipe_ingredients '
    + 'WHERE recipe_id IN ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error getting ingredients of recipes';
    else return result.rows.reduce((pVal, row) => {
        pVal[row.recipe_id.toString('hex')] = {
            recipeId: row.recipe_id.toString('hex'),
            id: row.ingredient_id.toString('hex'),
            amount: row.quantity,
            unit: row.unit ? row.unit : null,
            description: row.description ? row.description : null
        } as IngredientRecipeData;
        return pVal;
    }, {} as {[recipeId: string]: IngredientRecipeData});
}