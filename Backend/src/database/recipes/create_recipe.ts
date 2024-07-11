import { v4 as uuidV4 } from 'uuid';
import query from "../../utils/query.js";
import { DatabaseRecipeCreationData, Recipe } from "../../utils/types/recipe.js";

export async function createRecipe(options: DatabaseRecipeCreationData) {
    const recipeId = uuidV4();
    const createdAt = new Date()

    const params = [recipeId, options.name, options.description, options.instructions, createdAt, options.createdById, options.cookingTime, options.waitingTime, options.servings, options.public, options.typeId];
    if(options.sourceUrl) params.push(options.sourceUrl);
    else params.push("");
    if(options.imageUrl) params.push(options.imageUrl);
    else params.push("");
    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.recipes '
    + '(id, name, description, instructions, created_at, created_by, cooking_time, waiting_time, servings, public, type_id, source_url, image_url)'
    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error creating recipe';
    else return {
        id: recipeId,
        name: options.name,
        description: options.description,
        instructions: options.instructions,
        createdAt: new Date(createdAt),
        createdById: options.createdById,
        cookingTime: options.cookingTime,
        waitingTime: options.waitingTime,
        servings: options.servings,
        public: options.public,
        typeId: options.typeId,
        sourceUrl: options.sourceUrl,
        imageUrl: options.imageUrl
    } as Recipe;
}