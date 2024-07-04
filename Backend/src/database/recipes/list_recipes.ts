import query from "../../utils/query.js";
import { Recipe } from "../../utils/types.js";

export async function listUserRecipes(userId: string) {
    const params = [userId];
    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.recipes '
    + 'WHERE user_id = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error listing recipes for user';
    else return result.rows.map((row) => {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            instructions: row.instructions,
            createdAt: row.created_at,
            createdById: row.user_id,
            cookingTime: row.cooking_time,
            waitingTime: row.waiting_time,
            servings: row.servings,
            public: row.public,
            typeId: row.type_id,
            sourceUrl: row.source_url,
            imageUrl: row.image_url
        } as Recipe;
    });
}