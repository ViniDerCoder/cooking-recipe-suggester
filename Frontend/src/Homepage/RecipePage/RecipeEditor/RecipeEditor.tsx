import '../../../ColorScheme.css'
import './RecipeEditor.css'
import '../RecipePage.css'

import { MdPublic, MdPublicOff } from "react-icons/md";
import { Recipe, RecipeCreationData, RecipeEditData } from '../../../../../Backend/src/utils/types/recipe';
import { useState } from 'react';
import { getIngredientsOfRecipe, getRecipeById } from '../recipeLogic';
import { FullRecipeIngredient, Ingredient, IngredientRecipeData, RecipeIngredientUpdateActions } from '../../../../../Backend/src/utils/types/ingredient';

export default function RecipeEditor(p: { recipeId?: string }) {
    const [loading, setLoading] = useState<boolean>(true)
    const [recipe, setRecipe] = useState<RecipeEditData | RecipeCreationData | null>(null)
    const [ingredients, setIngredients] = useState<IngredientRecipeData | null>(null)
    const [ingredientsWithInformation, setIngredientsWithInformation] = useState<Ingredient | null>(null)

    if(p.recipeId) {
        (async () => {
            const [recipe, ingredients] = await Promise.all([
                getRecipeById(p.recipeId),
                getIngredientsOfRecipe(p.recipeId)
            ])

            if(recipe[0] && typeof recipe[1] !== "string") {
                setRecipe(recipe[1])
            }

            if(ingredients[0] && typeof ingredients[1] !== "string") {
                setIngredients(ingredients[1].map((ingredient: Ingredient) => ingredient.id))
            }
            setLoading(false)

        })()
    } else {
        
        setLoading(false)
    }

    //if(loading) return <div className="recipe-editor">Loading...</div>

    //if(!recipe || !ingredients) return <div className="recipe-editor">Error</div>

    return (
        <div className="recipe-editor">
            <div className='recipe-editor-header'>
                <div className='recipe-editor-header-title'>Rezept Editor</div>
                <div className='recipe-editor-header-type'>{p.recipeId ? "Bearbeiten" : "Erstellen"}</div>

                {p.recipeId ? <div className='recipe-editor-content-public'><MdPublic /></div> : null}
            </div>
            <div className='recipe-editor-content'>
                <div className='recipe-editor-content-texts'>
                    <div className='recipe-editor-content-name'></div>

                    <div className='recipe-editor-content-description'></div>
                </div>
                <div className="recipe-editor-content-times">
                    <div className='recipe-editor-content-cookingtime'></div>
                    <div className='recipe-editor-content-waitingtime'></div>
                </div>
                <div className='recipe-editor-content-servings'></div>

                <div className='recipe-editor-content-type'></div>

                <div className='recipe-editor-content-ingredients'></div>
            </div>
        </div>
    )
}