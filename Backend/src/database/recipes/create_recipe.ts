import { v4 as uuidV4 } from 'uuid';
import query from "../../utils/query.js";
import { Recipe } from "../../utils/types.js";

export async function createRecipe(options:
    {
        name: string,
        description: string,
        instructions: Array<string>,
        createdById: string,
        cookingTime: number,
        waitingTime: number,
        servings: number,
        public: boolean,
        typeId: string,
        sourceUrl: string | undefined,
        imageUrl: string | undefined
    }
) {
    const recipeId = uuidV4();
    console.log(recipeId)
    const createdAt = new Date()

    const params = [recipeId, options.name, options.description, options.instructions, createdAt, options.createdById, options.cookingTime, options.waitingTime, options.servings, options.public, options.typeId];
    if(options.sourceUrl) params.push(options.sourceUrl);
    if(options.imageUrl) params.push(options.imageUrl);
    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.recipes '
    + '(id, name, description, instructions, created_at, created_by, cooking_time, waiting_time, servings, public, type_id' + (options.sourceUrl ? ', source_url' : '') + (options.imageUrl ? ', image_url' : '') + ') '
    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?' + (options.sourceUrl ? ', ?' : '') + (options.imageUrl ? ', ?' : '') + ')';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error creating recipe';
    else return {
        id: recipeId,
        name: options.name,
        description: options.description,
        instructions: options.instructions,
        createdAt: createdAt,
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