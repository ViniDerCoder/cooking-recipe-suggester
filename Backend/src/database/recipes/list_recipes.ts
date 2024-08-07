import query from "../../utils/query.js";
import { Uuid } from "../../utils/types/other.js";
import { Recipe, RecipeUserData } from "../../utils/types/recipe.js";
import { MealSuggestionUserDataFilter } from "../../utils/types/suggestion.js";

export async function listUserRecipes(userId: Uuid) {
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
            createdAt: new Date(row.created_at),
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

export async function listUsersAddedRecipeData(userId: Uuid) {
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

export async function getUserDataFromRecipe(recipeId: Uuid, userId: Uuid) {
    const params = [userId, recipeId];
    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.user_recipes '
    + 'WHERE user_id = ? AND recipe_id = ?';

    const result = await query(q, params);
    if(typeof result === "string") return 'Error getting user data from recipe';
    else {
        const row = result.rows[0];
        if(!row) return "User has not added this recipe";
        return {
            recipeId: row.recipe_id.toString('hex'),
            userId: row.user_id.toString('hex'),
            rating: row.rating,
            notes: row.notes,
            cooked: row.cooked ? row.cooked : [],
            recipeDeletedName: row.recipe_deleted_name,
        } as RecipeUserData;
    }
}

export async function getUserDataFromRecipes(recipeIds: Uuid[], userId: Uuid) {
    const params = [userId, recipeIds];
    const q = ''
    + 'SELECT * FROM '
    + 'cooking_recipe_suggester.user_recipes '
    + 'WHERE user_id = ? AND recipe_id IN ?';

    const result = await query(q, params);
    if(typeof result === "string") return 'Error getting user data from recipes';
    else {
        const rows = result.rows;
        if(rows.length < 1) return "No recipes found";
        return rows.map((row) => {
            return {
                recipeId: row.recipe_id.toString('hex'),
                userId: row.user_id.toString('hex'),
                rating: row.rating,
                notes: row.notes,
                cooked: row.cooked ? row.cooked : [],
                recipeDeletedName: row.recipe_deleted_name,
                
            } as RecipeUserData
        });
    }
}