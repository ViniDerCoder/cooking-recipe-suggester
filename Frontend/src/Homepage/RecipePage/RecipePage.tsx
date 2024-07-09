import { useEffect, useState } from "react";
import { getIngredientsOfRecipe, getRecipeById } from "./recipeLogic";
import { Recipe } from '../../../../Backend/src/utils/types/recipe'
import { IngredientRecipeData } from '../../../../Backend/src/utils/types/ingredient'


export default function RecipePage(p: {recipeId: string}) {
    const [recipe, setRecipe] = useState<Recipe | null | false>(null);
    const [ingredients, setIngredients] = useState<IngredientRecipeData[] | null | false>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
        const loadRecipe = async () => {
            console.log(p.recipeId)
            const recipe = await getRecipeById(p.recipeId);
            if(recipe[0]) {
              const ingredients = await getIngredientsOfRecipe(p.recipeId);
              if(ingredients[0]) recipe[1].ingredients = ingredients[1];
              else setIngredients(false);

              setRecipe(recipe[1]);
            }
            else setRecipe(false);

            setIsLoading(false);
        };
  
        loadRecipe();
    }, [p.recipeId]);

    if (isLoading) {
        return <div>Loading...</div>; // Or any other loading indicator
    }

    if(recipe === false || recipe === null) {
        return <div>Recipe not found</div>
    }

    if(ingredients === false || ingredients === null) {
      return <div>Ingredients not loaded</div>
  }

    return (
        <div>
            <h1>{recipe.name}</h1>
            <p>{recipe.description}</p>
            {recipe.imageUrl ? <img src={recipe.imageUrl} alt={recipe.name} /> : null}
            <ul>
            </ul>
            <p>{recipe.instructions.map((instr, index) => {
                return <p>{index + 1}. {instr}</p>
            })}</p>
            <h2>Ingredients</h2>
            <ul>
                {ingredients.map((ingredient) => {
                    return <li>{ingredient.amount} {ingredient.unit ? ingredient.unit : ''} of {ingredient.id}</li>
                })}
            </ul>
        </div>
    )
}