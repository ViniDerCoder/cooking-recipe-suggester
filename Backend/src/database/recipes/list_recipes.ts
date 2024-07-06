import query from "../../utils/query.js";
import { Recipe, RecipeUserData } from "../../utils/types/recipe.js";

export async function listUserRecipes(userId: string) {
    const params = [userId];
    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.recipes '
    + 'WHERE created_by = ?'
    + 'ALLOW FILTERING';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error listing recipes for user';
    else return result.rows.map((row) => {
        return {
            id: row.id.toString('hex'),
            name: row.name,
            description: row.description,
            instructions: row.instructions,
            createdAt: row.created_at,
            createdById: row.created_by.toString('hex'),
            cookingTime: row.cooking_time,
            waitingTime: row.waiting_time,
            servings: row.servings,
            public: row.public,
            typeId: row.type_id.toString('hex'),
            sourceUrl: row.source_url,
            imageUrl: row.image_url
        } as Recipe;
    });
}

export async function listUsersAddedRecipeData(userId: string) {
    const params = [userId];
    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.user_recipes '
    + 'WHERE user_id = ?'

    const result = await query(q, params);
    if(typeof result === "string") return 'Error listing user added recipes';
    const userRecipeData = result.rows.map((row) => {
        return {
            recipeId: row.recipe_id.toString('hex'),
            userId: row.user_id.toString('hex'),
            rating: row.rating,
            notes: row.notes,
            cooked: row.cooked ? row.cooked : [],
            recipeDeletedName: row.recipe_deleted_name,
        } as RecipeUserData;
    });
    return userRecipeData;
}