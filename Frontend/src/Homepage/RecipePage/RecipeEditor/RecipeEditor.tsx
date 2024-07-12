import '../../../ColorScheme.css'
import './RecipeEditor.css'
import '../RecipePage.css'

import { MdPublic, MdPublicOff } from "react-icons/md";
import { BiSave, BiSolidSave } from "react-icons/bi";

import { Recipe, RecipeCreationData, RecipeEditData } from '../../../../../Backend/src/utils/types/recipe';
import { useEffect, useState } from 'react';
import { getIngredientsOfRecipe, getRecipeById } from '../recipeLogic';
import { Ingredient, IngredientRecipeData, RecipeIngredientUpdateActions } from '../../../../../Backend/src/utils/types/ingredient';
import Tooltip from '../../../Defaults/Tooltip/Tooltip';
import { editRecipe, getRecipeTypes } from './recipeEditorLogic';

export default function RecipeEditor(p: { recipeId?: string }) {
    console.log(p.recipeId)
    const [loading, setLoading] = useState<boolean>(true)
    const [recipe, setRecipe] = useState<RecipeEditData | RecipeCreationData | null>(null)
    const [ingredients, setIngredients] = useState<IngredientRecipeData | null>(null)
    const [ingredientChanges, setIngredientChanges] = useState<RecipeIngredientUpdateActions[]>([])
    const [ingredientsWithInformation, setIngredientsWithInformation] = useState<Ingredient | null>(null)
    const [recipeTypes, setRecipeTypes] = useState<{ name: string, id: string }[] | null>(null)
    const [changesMade, setChangesMade] = useState<boolean>(false)
    const [disabledButtons, setDisabledButtons] = useState({ save: false, public: false })

    useEffect(() => {
        if (p.recipeId) {
            (async () => {
                const [lRecipe, lIngredients, lTypes] = await Promise.all([
                    getRecipeById(p.recipeId),
                    getIngredientsOfRecipe(p.recipeId),
                    getRecipeTypes()
                ])

                if (lRecipe[0] && typeof lRecipe[1] !== "string") {
                    setRecipe(lRecipe[1] as RecipeEditData)
                }

                if (lIngredients[0] && typeof lIngredients[1] !== "string") {
                    setIngredients(lIngredients[1].map((ingredient: Ingredient) => ingredient.id))
                }

                if (lTypes[0] && typeof lTypes[1] !== "string") {
                    setRecipeTypes(lTypes[1])
                }
                setLoading(false)

            })()
        } else setLoading(false)
    }, [p.recipeId])

    if (loading) return <div className="recipe-editor">
        <div className='recipe-editor-header'>
            <div className='recipe-editor-header-title'>
                <div>Rezept Editor</div>
                <div className='recipe-editor-header-type'>Laden...</div>
            </div>
        </div>
    </div>

    if (!recipe || !ingredients) return <div className="recipe-editor">
        <div className='recipe-editor-header'>
            <div className='recipe-editor-header-title'>
                <div>Rezept Editor</div>
                <div className='recipe-editor-header-type'>Laden fehlgeschlage</div>
            </div>
        </div>
    </div>

    return (
        <div className="recipe-editor">
            <div className='recipe-editor-header'>
                {recipe && "public" in recipe ? <div className='recipe-editor-header-public'
                    style={{ opacity: disabledButtons.public ? 0.5 : 1 }}
                    onClick={() => {
                        if (disabledButtons.public) return
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
                    style={{ opacity: disabledButtons.save ? 0.5 : 1 }}
                    onClick={() => {
                        if (disabledButtons.save || !changesMade) return
                        setDisabledButtons({ ...disabledButtons, save: true })
                        if (!recipe) return
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
                <div className='recipe-editor-content-image'>
                    <div className='recipe-editor-content-image-title'>Bild</div>
                    <input className='recipe-editor-content-image-input' type="file" onInput={(event) => {
                        if (!recipe) return
                        let file = (event.target as HTMLInputElement).files?.[0]
                        if (!file) return
                        let reader = new FileReader()
                        reader.onload = (e) => {
                            if (!recipe) return
                            setRecipe({ ...recipe, imageUrl: (e.target?.result as string) })
                            setChangesMade(true)
                        }
                        reader.readAsDataURL(file)
                    }}/>
                    <div className='recipe-editor-content-image-info'>Wähle ein Bild für dein Rezept!</div>
                </div>
                <div className='recipe-editor-content-texts'>
                    <div className='recipe-editor-content-name'>
                        <div className='recipe-editor-content-name-title'>Name</div>
                        <input className='recipe-editor-content-name-input'
                            value={recipe?.name ? recipe.name : undefined}
                            onInput={(e) => {
                                if (!recipe) return
                                setRecipe({ ...recipe, name: (e.target as HTMLInputElement).value })
                                setChangesMade(true)
                            }}
                        /></div>

                    <div className='recipe-editor-content-description'>
                        <div className='recipe-editor-content-name-title'>Beschreibung</div>
                        <input className='recipe-editor-content-description-input'
                            value={recipe?.description ? recipe.description : undefined}
                            onInput={(e) => {
                                if (!recipe) return
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
                                if (val.length === 0) val = "0"
                                if (isNaN(parseInt(val))) return
                                if (!recipe) return
                                setRecipe({ ...recipe, cookingTime: parseInt(val) })
                                setChangesMade(true)
                            }}
                            step={1}
                            type="number"
                        />
                    </div>
                    <div className='recipe-editor-content-waitingtime'>
                        <div className='recipe-editor-content-waitingtime-title'>Wartezeit</div>
                        <input
                            value={recipe?.waitingTime ? recipe.waitingTime : undefined}
                            onInput={(e) => {
                                let el = (e.target as HTMLInputElement)
                                if (el.value.length === 0) el.value = "0"
                                if (isNaN(parseInt(el.value))) return
                                if (!recipe) return
                                setRecipe({ ...recipe, waitingTime: parseInt(el.value) })
                                setChangesMade(true)
                            }}
                            step={1}
                            type="number"
                        />
                    </div>
                </div>
                <div className='recipe-editor-content-servings'>
                    <div className='recipe-editor-content-servings-title'>Portionen</div>
                    <input
                        value={recipe?.servings ? recipe.servings : undefined}
                        onInput={(e) => {
                            if (!recipe) return
                            let el = (e.target as HTMLInputElement)
                            if (el.value.length === 0) el.value = "0"
                            if (isNaN(parseInt(el.value))) return
                            setRecipe({ ...recipe, servings: parseInt(el.value) })
                            setChangesMade(true)
                        }}
                        step={1}
                        type="number"
                    />
                </div>

                {recipeTypes ?
                    <div className='recipe-editor-content-type'>
                        <div className='recipe-editor-content-type-title'>Typ</div>
                        <div className='recipe-editor-content-type-info'>Wähle den Typ, welcher am besten passt!</div>
                        <div className='recipe-editor-content-type-select'>
                            <select
                                onChange={(e) => {
                                    if (!recipe) return
                                    setRecipe({ ...recipe, typeId: (e.target as HTMLSelectElement).value })
                                    setChangesMade(true)
                                }}
                            >
                                {recipeTypes.sort((a, b) => a.name.localeCompare(b.name)).map((type) => {
                                    return <option selected={recipe.typeId === type.id ? true : false} className='recipe-editor-content-type-select-option' key={type.id} value={type.id}>{type.name}</option>
                                })}
                            </select>
                        </div>
                    </div> : null}

                <div className='recipe-editor-content-ingredients'></div>
            </div>
        </div>
    )
}