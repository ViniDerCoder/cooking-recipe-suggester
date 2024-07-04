import query from "../../utils/query.js";
import { Recipe } from "../../utils/types.js";

export async function getRecipeById(id: string) {
    const params = [id];
    const q = ''
    + 'SELECT * '
    + 'FROM '
    + 'cooking_recipe_suggester.recipes '
    + 'WHERE id = ?';

    const result = await query(q, params);
    if(typeof result === "string") return 'Error getting recipe';
    if(result.rows.length > 0) {
        return {
            id: result.rows[0].id,
            name: result.rows[0].name,
            description: result.rows[0].description,
            instructions: result.rows[0].instructions,
            createdById: result.rows[0].created_by,
            createdAt: result.rows[0].created_at,
            cookingTime: result.rows[0].cooking_time,
            waitingTime: result.rows[0].waiting_time,
            servings: result.rows[0].servings,
            public: result.rows[0].public,
            typeId: result.rows[0].type_id,
            sourceUrl: result.rows[0].source_url,
            imageUrl: result.rows[0].image_url
        } as Recipe;
    }
    else return 'Recipe not found';
}