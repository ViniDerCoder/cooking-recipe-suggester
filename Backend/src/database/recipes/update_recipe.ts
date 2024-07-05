import query from "../../utils/query.js";
import { editabelRecipeProperties } from "../../utils/types.js";
import { getRecipeById } from "./get_recipe.js";

export async function updateRecipe(recipeId: string, changedProperties: {[key: string]: any}) {
    if(!Object.keys(changedProperties).every((key) => editabelRecipeProperties.includes(key as any))) return 'Invalid changes provided';
    if(!changedProperties || typeof changedProperties !== 'object') return 'No changes provided';
    
    const params = []
    if(changedProperties["name"]) params.push(changedProperties["name"]);
    if(changedProperties["description"]) params.push(changedProperties["description"]);
    if(changedProperties["instructions"]) params.push(changedProperties["instructions"]);
    if(changedProperties["cookingTime"]) params.push(changedProperties["cookingTime"]);
    if(changedProperties["waitingTime"]) params.push(changedProperties["waitingTime"]);
    if(changedProperties["servings"]) params.push(changedProperties["servings"]);
    if(changedProperties["public"]) params.push(changedProperties["public"]);
    if(changedProperties["typeId"]) params.push(changedProperties["typeId"]);
    if(changedProperties["imageUrl"]) params.push(changedProperties["imageUrl"]);

    params.push(recipeId);

    const q = ''
    + 'UPDATE '
    + 'cooking_recipe_suggester.recipes '
    + 'SET '
    + changedProperties["name"] ? 'name = ?, ' : ''
    + changedProperties["description"] ? 'description = ?, ' : ''
    + changedProperties["instructions"] ? 'instructions = ?, ' : ''
    + changedProperties["cookingTime"] ? 'cooking_time = ?, ' : ''
    + changedProperties["waitingTime"] ? 'waiting_time = ?, ' : ''
    + changedProperties["servings"] ? 'servings = ?, ' : ''
    + changedProperties["public"] ? 'public = ?, ' : ''
    + changedProperties["typeId"] ? 'type_id = ?, ' : ''
    + changedProperties["imageUrl"] ? 'image_url = ? ' : ''
    + 'WHERE id = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error updating recipe';

    const newRecipe = await getRecipeById(recipeId);
    return newRecipe;
}   