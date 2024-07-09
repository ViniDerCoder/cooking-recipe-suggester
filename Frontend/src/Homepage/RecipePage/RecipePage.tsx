import { useEffect, useState } from "react";
import { getRecipeById } from "./recipeLogic";
import { Recipe } from '../../../../Backend/src/utils/types/recipe'


export default function RecipePage(p: {recipeId: string}) {
    const [recipe, setRecipe] = useState<Recipe | null | false>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const loadRecipe = async () => {
        console.log(p.recipeId)
        const authToken = await getRecipeById(p.recipeId);
        if(authToken[0]) setRecipe(authToken[1]);
        else setRecipe(false);

        setIsLoading(false);
      };
  
      loadRecipe();
    }, [p.recipeId]);

    if (isLoading) {
      return <div>Loading...</div>; // Or any other loading indicator
    }

    if(recipe === false) {
        return <div>Recipe not found</div>
    }

    return (
        <div>

        </div>
    )
}