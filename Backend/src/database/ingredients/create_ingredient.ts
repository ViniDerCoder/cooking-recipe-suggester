import { v4 as uuidV4 } from 'uuid';

import query from '../../utils/query.js';
import { Ingredient, IngredientProperties } from '../../utils/types/ingredient.js';

export async function createNewIngredient(name: string, properties: IngredientProperties) {
    const ingredientId = uuidV4()

    const params = [ingredientId, name, properties.vegan, properties.vegetarian, properties.glutenFree, properties.dairyFree, properties.nutFree, properties.eggFree, properties.fishFree, properties.shellfishFree, properties.soyFree];
    const q = ''
    + 'INSERT INTO '
    + 'cooking_recipe_suggester.ingredients '
    + '(id, name, vegan, vegetarian, gluten_free, dairy_free, nut_free, egg_free, fish_free, shellfish_free, soy_free) '
    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const result = await query(q, params)

    if(typeof result === "string") return 'Error creating ingredient';
    else return {
        ingredient: {
            id: ingredientId,
            name: name,
            properties: properties
        } as Ingredient
    };
}