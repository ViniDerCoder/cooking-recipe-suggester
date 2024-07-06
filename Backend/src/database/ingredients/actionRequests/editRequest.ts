import { v4 } from "uuid";

import query from "../../../utils/query.js";
import { IngredientProperties } from "../../../utils/types/ingredient.js";

export default async function editRequest(userId: string, ingredientId: string, ingredient: {name: string, props: IngredientProperties}) {
    const actionId = v4();
    const createdAt = new Date();

    const data = JSON.stringify({
        name: ingredient.name,
        properties: {
            vegan: ingredient.props.vegan,
            vegetarian: ingredient.props.vegetarian,
            glutenFree: ingredient.props.glutenFree,
            dairyFree: ingredient.props.dairyFree,
            nutFree: ingredient.props.nutFree,
            eggFree: ingredient.props.eggFree,
            fishFree: ingredient.props.fishFree,
            shellfishFree: ingredient.props.shellfishFree,
            soyFree: ingredient.props.soyFree
        }
    });

    const params = [actionId, "UPDATE", createdAt, userId, ingredientId, data];
    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.ingredient_action_requests '
    + '(id, action, created_at, created_by, ingredient_id, data) '
    + 'VALUES (?, ?, ?, ?, ?, ?)';

    const result = await query(q, params)
    if(typeof result === "string") return 'Error creating update request';
    else return {
        actionId: actionId,
        action: "UPDATE",
        createdAt: createdAt,
        userId: userId,
        ingredientId: ingredientId,
        data: JSON.parse(data)
    };
}