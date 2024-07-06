import query from "../../utils/query.js";
import { editabelRecipeProperties } from "../../utils/types.js";

export async function updateRecipe(recipeId: string, changedProperties: {[key: string]: any}) {
    if(!Object.keys(changedProperties).every((key) => editabelRecipeProperties.includes(key as any))) return 'Invalid changes provided';
    if(!changedProperties || typeof changedProperties !== 'object') return 'No changes provided';
    
    const params = []
    if(changedProperties["name"] !== undefined) params.push(changedProperties["name"]);
    if(changedProperties["description"] !== undefined) params.push(changedProperties["description"]);
    if(changedProperties["instructions"] !== undefined) params.push(changedProperties["instructions"]);
    if(changedProperties["cookingTime"] !== undefined) params.push(changedProperties["cookingTime"]);
    if(changedProperties["waitingTime"] !== undefined) params.push(changedProperties["waitingTime"]);
    if(changedProperties["servings"] !== undefined) params.push(changedProperties["servings"]);
    if(changedProperties["public"] !== undefined) params.push(changedProperties["public"]);
    if(changedProperties["typeId"] !== undefined) params.push(changedProperties["typeId"]);
    if(changedProperties["imageUrl"] !== undefined) params.push(changedProperties["imageUrl"]);

    params.push(recipeId);

    let q = ''
    + 'UPDATE '
    + 'cooking_recipe_suggester.recipes '
    + 'SET '
    + (changedProperties["name"] !== undefined ? 'name = ?, ' : '')
    + (changedProperties["description"] !== undefined ? 'description = ?, ' : '')
    + (changedProperties["instructions"] !== undefined ? 'instructions = ?, ' : '')
    + (changedProperties["cookingTime"] !== undefined ? 'cooking_time = ?, ' : '')
    + (changedProperties["waitingTime"] !== undefined ? 'waiting_time = ?, ' : '')
    + (changedProperties["servings"] !== undefined ? 'servings = ?, ' : '')
    + (changedProperties["public"] !== undefined ? 'public = ?, ' : '')
    + (changedProperties["typeId"] !== undefined ? 'type_id = ?, ' : '')
    + (changedProperties["imageUrl"] !== undefined ? 'image_url = ?, ' : '');

    q = q.slice(0, -2);
    q = q + ' WHERE id = ?';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error updating recipe';
    return undefined;
}   