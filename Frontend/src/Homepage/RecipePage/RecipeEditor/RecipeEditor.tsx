import '../../../ColorScheme.css'
import './RecipeEditor.css'
import '../RecipePage.css'

import { MdPublic, MdPublicOff } from "react-icons/md";
import { BiSave, BiSolidSave } from "react-icons/bi";

import { RecipeCreationData, RecipeEditData } from '../../../../../Backend/src/utils/types/recipe';
import { useEffect, useState } from 'react';
import { getIngredientsOfRecipe, getRecipeById } from '../recipeLogic';
import { Ingredient, IngredientRecipeData, RecipeIngredientUpdateActions } from '../../../../../Backend/src/utils/types/ingredient';
import Tooltip from '../../../Defaults/Tooltip/Tooltip';
import { editRecipe } from './recipeEditorLogic';

export default function RecipeEditor(p: { recipeId?: string }) {
    console.log(p.recipeId)
    const [loading, setLoading] = useState<boolean>(true)
    const [recipe, setRecipe] = useState<RecipeEditData | RecipeCreationData | null>(null)
    const [ingredients, setIngredients] = useState<IngredientRecipeData | null>(null)
    const [ingredientChanges, setIngredientChanges] = useState<RecipeIngredientUpdateActions[]>([])
    const [ingredientsWithInformation, setIngredientsWithInformation] = useState<Ingredient | null>(null)
    const [changesMade, setChangesMade] = useState<boolean>(false)
    const [disabledButtons, setDisabledButtons] = useState({ save: false, public: false })

    useEffect(() => {
        if (p.recipeId) {
            (async () => {
                const [recipe, ingredients] = await Promise.all([
                    getRecipeById(p.recipeId),
                    getIngredientsOfRecipe(p.recipeId)
                ])

                if (recipe[0] && typeof recipe[1] !== "string") {
                    setRecipe(recipe[1])
                }

                if (ingredients[0] && typeof ingredients[1] !== "string") {
                    setIngredients(ingredients[1].map((ingredient: Ingredient) => ingredient.id))
                }
                setLoading(false)

            })()
        } else setLoading(false)
    }, [p.recipeId])

    //if(loading) return <div className="recipe-editor">Loading...</div>

    //if(!recipe || !ingredients) return <div className="recipe-editor">Error</div>

    return (
        <div className="recipe-editor">
            <div className='recipe-editor-header'>
                {recipe && "public" in recipe ? <div className='recipe-editor-header-public'
                    style={{ opacity: disabledButtons.public ? 0.5 : 1}}
                    onClick={() => {
                        if(disabledButtons.public) return
                        setDisabledButtons({ ...disabledButtons, public: true })
                        setRecipe({ ...recipe, public: !recipe.public })
                        setChangesMade(true)
                        setTimeout(() => setDisabledButtons({ ...disabledButtons, public: false }), 1000)
                    }}
                ><Tooltip
                        element={recipe.public ? <MdPublic size={"2rem"} /> : <MdPublicOff size={"2rem"} />}
                        message={recipe.public ? "Öffentlich" : "Privat"}
                    /></div> : null}
                <div className='recipe-editor-header-title'>
                    <div>Rezept Editor</div>
                    <div className='recipe-editor-header-type'>{p.recipeId ? "Bearbeiten" : "Erstellen"}</div>
                </div>
                <div className='recipe-editor-header-save'
                    style={{ opacity: disabledButtons.save ? 0.5 : 1}}
                    onClick={() => {
                        if (disabledButtons.save || !changesMade) return
                        setDisabledButtons({ ...disabledButtons, save: true })
                        if(!recipe) return
                        if ("public" in recipe) {

                            editRecipe(p.recipeId, recipe, ingredientChanges).then(([success, error]) => {
                                if (success) {
                                    setChangesMade(false)
                                } else {
                                    console.error(error)
                                }
                            })
                        } else {
                            //createRecipe(recipe, ingredients)
                        }
                        setTimeout(() => setDisabledButtons({ ...disabledButtons, save: false }), 1000)
                    }}
                ><Tooltip
                        element={changesMade ? <BiSolidSave size={"2rem"} /> : <BiSave size={"2rem"} />}
                        message={changesMade ? "Speichern" : "Nichs zu speichern"}
                        sx={{ style: { marginRight: "2rem" } }}
                    /></div>
            </div>
            <div className='recipe-editor-content'>
                <div className='recipe-editor-content-texts'>
                    <div className='recipe-editor-content-name'><input 
                        value={recipe?.name ? recipe.name : undefined}
                        onInput={(e) => {
                            if(!recipe) return
                            setRecipe({ ...recipe, name: (e.target as HTMLInputElement).value })
                            setChangesMade(true)
                        }}
                    /></div>

                    <div className='recipe-editor-content-description'><input 
                        value={recipe?.description ? recipe.description : undefined}
                        onInput={(e) => {
                            if(!recipe) return
                            setRecipe({ ...recipe, description: (e.target as HTMLInputElement).value })
                            setChangesMade(true)
                        }}
                    /></div>
                </div>
                <div className="recipe-editor-content-times">
                    <div className='recipe-editor-content-cookingtime'>
                        <div className='recipe-editor-content-cookingtime-title'>Kochzeit</div>
                        <input 
                            value={recipe?.cookingTime ? recipe.cookingTime : undefined}
                            onInput={(e) => {
                                let val = (e.target as HTMLInputElement).value
                                if(val.length === 0) val = "0"
                                if(isNaN(parseInt(val))) return
                                if(!recipe) return
                                setRecipe({ ...recipe, cookingTime: parseInt(val) })
                                setChangesMade(true)
                            }}
                        />
                    </div>
                    <div className='recipe-editor-content-waitingtime'></div>
                </div>
                <div className='recipe-editor-content-servings'></div>

                <div className='recipe-editor-content-type'></div>

                <div className='recipe-editor-content-ingredients'></div>
            </div>
        </div>
    )
}