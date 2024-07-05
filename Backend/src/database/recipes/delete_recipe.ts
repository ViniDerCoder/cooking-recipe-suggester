import query from "../../utils/query.js";
import { Recipe } from "../../utils/types.js";


export async function deleteRecipe(recipe: Recipe) {

    const p1 = [recipe.id];
    const q1 = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.user_recipes '
    + 'WHERE recipe_id = ? '
    + 'ALLOW FILTERING';
    const r1 = await query(q1, p1);

    if(typeof r1 === "string") return 'Error getting user recipe links';

    const p2 = [recipe.id];
    const q2 = ''
    + 'DELETE FROM '
    + 'cooking_recipe_suggester.recipe_ingredients '
    + 'WHERE recipe_id = ?';
    const r2 = await query(q2, p2);

    const p3 = [recipe.id];
    const q3 = ''
    + 'DELETE FROM '
    + 'cooking_recipe_suggester.recipes '
    + 'WHERE id = ?';
    const r3 = await query(q3, p3);

    if(typeof r2 === "string") return 'Error getting user recipe links';
    if(typeof r3 === "string") return 'Error deleting recipe';
    
    if(!r1.rows[0]) return undefined;
    
    const userIds = r1.rows.map((row) => row.user_id as string);
    if(userIds.length === 0) return undefined;

    const p4 = [recipe.name, recipe.id].concat(userIds);
    const q4 = ''
    + 'UPDATE '
    + 'cooking_recipe_suggester.user_recipes '
    + 'SET recipe_deleted_name = ? '
    + `WHERE recipe_id = ? AND (user_id = ? ${userIds.slice(1).map((_, i) => `OR user_id = ?`).join(' ')})`;
    const r4 = await query(q4, p4);

    if(typeof r4 === "string") return 'Error unlinking user from recipe';

    return undefined;
}