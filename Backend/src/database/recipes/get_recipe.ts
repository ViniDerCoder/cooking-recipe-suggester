import * as uuid from "uuid";

import query from "../../utils/query.js";
import { Recipe } from "../../utils/types/recipe.js";
import { Uuid } from "../../utils/types/other.js";
import { MealSuggestionRecipeFilter } from "../../utils/types/suggestion.js";

export async function getRecipeById(id: Uuid) {
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
            id: result.rows[0].id.toString('hex'),
            name: result.rows[0].name,
            description: result.rows[0].description,
            instructions: result.rows[0].instructions,
            createdById: result.rows[0].created_by.toString('hex'),
            createdAt: result.rows[0].created_at,
            cookingTime: result.rows[0].cooking_time,
            waitingTime: result.rows[0].waiting_time,
            servings: result.rows[0].servings,
            public: result.rows[0].public,
            typeId: result.rows[0].type_id.toString('hex'),
            sourceUrl: result.rows[0].source_url,
            imageUrl: result.rows[0].image_url
        } as Recipe;
    }
    else return 'Recipe not found';
}

export async function getRecipesByIds(ids: Array<Uuid>) {
    if(ids.length === 0) return [];

    const params = [ids];
    const q = ''
    + 'SELECT * '
    + 'FROM '
    + 'cooking_recipe_suggester.recipes '
    + `WHERE id IN ?`;

    const result = await query(q, params);
    if(typeof result === "string") return 'Error getting recipe';
    if(result.rows.length > 0) {
        return result.rows.map((row) => { 
            return {
                id: row.id.toString('hex'),
                name: row.name,
                description: row.description,
                instructions: row.instructions,
                createdById: row.created_by.toString('hex'),
                createdAt: row.created_at,
                cookingTime: row.cooking_time,
                waitingTime: row.waiting_time,
                servings: row.servings,
                public: row.public,
                typeId: row.type_id.toString('hex'),
                sourceUrl: row.source_url,
                imageUrl: row.image_url
            } as Recipe;
        })
    }
    else return [];
}

export async function getRecipesWithTypeIn(recipeIds: Array<Uuid>, validTypes: Array<Uuid>) {
    if(recipeIds.length === 0) return [];

    const params: Array<Array<Uuid>> = [recipeIds];

    if(validTypes.length > 0) params.push(validTypes);

    const q = ''
    + 'SELECT * '
    + 'FROM '
    + 'cooking_recipe_suggester.recipes '
    + `WHERE id IN ? `
    + (validTypes.length > 0 ? 'AND type_id IN ? ' : '')

    const result = await query(q, params);
    if(typeof result === "string") return 'Error getting recipe';
    if(result.rows.length > 0) {
        return result.rows.map((row) => { 
            return {
                id: row.id.toString('hex'),
                name: row.name,
                description: row.description,
                instructions: row.instructions,
                createdById: row.created_by.toString('hex'),
                createdAt: new Date(row.created_at),
                cookingTime: row.cooking_time,
                waitingTime: row.waiting_time,
                servings: row.servings,
                public: row.public,
                typeId: row.type_id.toString('hex'),
                sourceUrl: row.source_url,
                imageUrl: row.image_url
            } as Recipe;
        })
    }
    else return [];
}