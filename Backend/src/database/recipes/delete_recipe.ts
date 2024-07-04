import query from "../../utils/query.js";

export async function deleteRecipe(id: string) {
    const params = [id];
    const q = ''
    + 'DELETE FROM '
    + 'cooking_recipe_suggester.recipes '
    + 'WHERE id = ?';

    const result = await query(q, params);
    if(typeof result === "string") return 'Error deleting recipe';
    else return undefined;
}