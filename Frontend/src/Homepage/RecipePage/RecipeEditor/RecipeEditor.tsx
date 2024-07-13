import '../../../ColorScheme.css'
import './RecipeEditor.css'
import '../RecipePage.css'

import { MdPublic, MdPublicOff } from "react-icons/md";
import { BiSave, BiSolidSave } from "react-icons/bi";

import { RecipeCreationData, RecipeEditData } from '../../../../../Backend/src/utils/types/recipe';
import { createRef, useEffect, useState } from 'react';
import { getIngredientsOfRecipe, getRecipeById } from '../recipeLogic';
import { FullRecipeIngredient, IngredientUpdateActionList, RecipeIngredientUpdateActions } from '../../../../../Backend/src/utils/types/ingredient';
import Tooltip from '../../../Defaults/Tooltip/Tooltip';
import { editRecipe, getRecipeTypes } from './recipeEditorLogic';
import { LuUndo2 } from 'react-icons/lu';
import { TbClockHour4, TbClockPause } from 'react-icons/tb';
import IngredientSelector from './IngredientSelector/IngredientSelector';

type EditorFields = "IMAGE" | "NAME" | "DESCRIPTION" | "TYPE" | "COOKINGTIME" | "WAITINGTIME" | "SERVINGS" | "INGREDIENTS" | "PUBLIC"

export default function RecipeEditor(p: { recipeId?: string }) {
    console.log(p.recipeId)
    const [loading, setLoading] = useState<boolean>(true)
    const [recipe, setRecipe] = useState<RecipeEditData | RecipeCreationData | null>(null)
    const [ingredients, setIngredients] = useState<FullRecipeIngredient[] | null>(null)
    const [ingredientChanges, setIngredientChanges] = useState<RecipeIngredientUpdateActions[]>([])
    const [recipeTypes, setRecipeTypes] = useState<{ name: string, id: string }[] | null>(null)
    const [disabledButtons, setDisabledButtons] = useState({ save: false, public: false, back: false })
    const [changesStack, setChangesStack] = useState<{ field: EditorFields, newValue: any, oldValue: any }[]>([])

    const previewImage = createRef<HTMLImageElement>()
    const ingredientSelector = createRef<typeof IngredientSelector>()

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
                    setIngredients(lIngredients[1])
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
                <div className='recipe-editor-header-type'>Laden fehlgeschlagen</div>
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
                        newChange("PUBLIC", !recipe.public, recipe.public, [recipe, setRecipe], [changesStack, setChangesStack])
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
                <div className='recipe-editor-header-back'
                    style={{ opacity: changesStack.length === 0 || disabledButtons.back ? 0.5 : 1 }}
                    onClick={() => {
                        if (disabledButtons.back || changesStack.length === 0) return
                        setDisabledButtons({ ...disabledButtons, back: true })
                        if (changesStack.length < 1) return
                        changeBack([changesStack, setChangesStack], [recipe, setRecipe], ingredientSelector)
                        setTimeout(() => setDisabledButtons({ ...disabledButtons, back: false }), 100)
                    }}
                ><Tooltip
                        element={<LuUndo2 size={"2rem"} style={{ marginRight: "1rem" }} />}
                        message={"Zurück"}
                    />
                </div>
                <div className='recipe-editor-header-save'
                    style={{ opacity: disabledButtons.save ? 0.5 : 1 }}
                    onClick={() => {
                        if (disabledButtons.save || changesStack.length === 0) return
                        setDisabledButtons({ ...disabledButtons, save: true })
                        if (!recipe) return
                        if ("public" in recipe) {

                            editRecipe(p.recipeId, recipe, ingredientChanges).then(([success, error]) => {
                                if (success) {
                                    setChangesStack([])
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
                        element={changesStack.length !== 0 ? <BiSolidSave size={"2rem"} /> : <BiSave size={"2rem"} />}
                        message={changesStack.length !== 0 ? "Speichern" : "Nichs zu speichern"}
                        sx={{ style: { marginRight: "2rem" } }}
                    />
                </div>
            </div>
            <div className='recipe-editor-content'>
                <div className='recipe-editor-content-image'>
                    <div className='recipe-editor-content-image-title'>Bild</div>
                    <div className='recipe-editor-content-image-preview'>
                        <img ref={previewImage} alt={recipe.name || ""} src={recipe.imageUrl || ""} />
                        <input type="file" accept='image/png, image/jpeg'
                            onChange={(event) => {
                                if (!recipe) return
                                let file = (event.target as HTMLInputElement).files?.[0]
                                if (!file) return
                                let reader = new FileReader()
                                reader.onload = (e) => {
                                    if (!recipe) return
                                    newChange("IMAGE", e.target?.result as string, recipe.imageUrl, [recipe, setRecipe], [changesStack, setChangesStack])
                                }
                                reader.readAsDataURL(file)
                            }}
                            onMouseEnter={(e) => {
                                const current = previewImage.current
                                if (!current) return
                                current.dataset.hover = "true"
                            }}
                            onMouseLeave={(e) => {
                                const current = previewImage.current
                                if (!current) return
                                current.dataset.hover = "false"
                            }}
                        />
                    </div>
                    <div className='recipe-editor-content-image-info'>Wähle ein Bild für dein Rezept durch Klicken des Bildes!</div>
                </div>
                <div className='recipe-editor-content-texts'>
                    <div className='recipe-editor-content-name'>
                        <div className='recipe-editor-content-title'>Name</div>
                        <input className='recipe-editor-content-name-input'
                            value={recipe?.name ? recipe.name : undefined}
                            onChange={(e) => {
                                if (!recipe) return
                                newChange("NAME", (e.target as HTMLInputElement).value as string, recipe.name, [recipe, setRecipe], [changesStack, setChangesStack])
                            }}
                        />
                    </div>

                    <div className='recipe-editor-content-description'>
                        <div className='recipe-editor-content-title'>Beschreibung</div>
                        <textarea className='recipe-editor-content-description-input'
                            value={recipe?.description ? recipe.description : undefined}
                            onChange={(e) => {
                                if (!recipe) return
                                newChange("DESCRIPTION", (e.target as HTMLTextAreaElement).value as string, recipe.description, [recipe, setRecipe], [changesStack, setChangesStack])
                            }}
                            style={{ resize: "none" }}
                        />
                    </div>

                    {recipeTypes ?
                        <div className='recipe-editor-content-type'>
                            <div className='recipe-editor-content-title'>Typ</div>
                            <div className='recipe-editor-content-type-info'>Wähle den Typ, welcher am besten passt!</div>
                            <div className='recipe-editor-content-type-select'>
                                <select
                                    onChange={(e) => {
                                        if (!recipe) return
                                        newChange("TYPE", (e.target as HTMLSelectElement).value as string, recipe.typeId, [recipe, setRecipe], [changesStack, setChangesStack])
                                    }}
                                >
                                    {recipeTypes.sort((a, b) => a.name.localeCompare(b.name)).map((type) => {
                                        return <option selected={recipe.typeId === type.id ? true : false} className='recipe-editor-content-type-select-option' key={type.id} value={type.id}>{type.name}</option>
                                    })}
                                </select>
                            </div>
                        </div> : null
                    }
                </div>
                <div className="recipe-editor-content-times">
                    <div className='recipe-editor-content-cookingtime'>
                        <div className='recipe-editor-content-title'><TbClockHour4 style={{ justifySelf: "center" }} /><div>Kochzeit</div></div>
                        <input
                            value={recipe?.cookingTime ? recipe.cookingTime : undefined}
                            onChange={(e) => {
                                let el = (e.target as HTMLInputElement)
                                if (el.value.length === 0) el.value = "0"
                                if (isNaN(parseInt(el.value))) return
                                if (parseInt(el.value) < 0) el.value = "0"
                                if (!recipe) return
                                newChange("COOKINGTIME", parseInt(el.value), recipe.cookingTime, [recipe, setRecipe], [changesStack, setChangesStack])
                            }}
                            step={1}
                            type="number"
                        />
                    </div>
                    <div className='recipe-editor-content-waitingtime'>
                        <div className='recipe-editor-content-title'><TbClockPause style={{ justifySelf: "center" }} /><div>Wartezeit</div></div>
                        <input
                            value={recipe?.waitingTime ? recipe.waitingTime : undefined}
                            onChange={(e) => {
                                let el = (e.target as HTMLInputElement)
                                if (el.value.length === 0) el.value = "0"
                                if (isNaN(parseInt(el.value))) return
                                if (parseInt(el.value) < 0) el.value = "0"
                                if (!recipe) return
                                newChange("WAITINGTIME", parseInt(el.value), recipe.waitingTime, [recipe, setRecipe], [changesStack, setChangesStack])
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
                        onChange={(e) => {
                            let el = (e.target as HTMLInputElement)
                            if (el.value.length === 0) el.value = "1"
                            if (isNaN(parseInt(el.value))) return
                            if (parseInt(el.value) < 1) el.value = "1"
                            if (!recipe) return
                            newChange("SERVINGS", parseInt(el.value), recipe.servings, [recipe, setRecipe], [changesStack, setChangesStack])
                        }}
                        step={1}
                        type="number"
                    />
                </div>

                <div className='recipe-editor-content-ingredients'>
                    <IngredientSelector
                        ref={ingredientSelector}
                        initialIngredients={ingredients}
                        onIngredientAdd={(ingr: FullRecipeIngredient) => {
                            if (ingredientChanges.find((change) => change.ingredientId === ingr.id)) {
                                setIngredientChanges(ingredientChanges.map((change) => {
                                    if (change.ingredientId === ingr.id && change.type === "REMOVE") {
                                        return { type: "UPDATE", ingredientId: ingr.id, amount: ingr.amount, unit: ingr.unit }
                                    } else if (change.ingredientId === ingr.id && change.type === "ADD") {
                                        return { type: "ADD", ingredientId: ingr.id, amount: ingr.amount, unit: ingr.unit }
                                    } else if (change.ingredientId === ingr.id && change.type === "UPDATE") {
                                        return { type: "UPDATE", ingredientId: ingr.id, amount: ingr.amount, unit: ingr.unit }
                                    }
                                    return change
                                }))
                            } else {
                                setIngredientChanges([...ingredientChanges, { type: "ADD", ingredientId: ingr.id, amount: ingr.amount, unit: ingr.unit }])
                            }
                            setChangesStack([...changesStack, { field: "INGREDIENTS", newValue: ingr, oldValue: undefined }])
                        }}
                        onIngredientRemove={(ingr: FullRecipeIngredient) => {
                            if (ingredientChanges.find((change) => change.ingredientId === ingr.id)) {
                                const newChanges = ingredientChanges.map((change) => {
                                    if (change.ingredientId === ingr.id && change.type === "ADD") {
                                        return undefined
                                    } else if (change.ingredientId === ingr.id && change.type === "UPDATE") {
                                        return { type: "REMOVE" as const, ingredientId: ingr.id }
                                    }
                                    return change
                                }).filter((change) => change !== undefined)
                                setIngredientChanges(newChanges as any)
                            } else {
                                setIngredientChanges([...ingredientChanges, { type: "REMOVE", ingredientId: ingr.id }])
                            }
                            setChangesStack([...changesStack, { field: "INGREDIENTS", newValue: undefined, oldValue: ingr }])
                        }
                        }
                        onIngredientChange={(newIngr: FullRecipeIngredient, oldIngr: FullRecipeIngredient) => {
                            if (ingredientChanges.find((change) => change.ingredientId === newIngr.id)) {
                                setIngredientChanges(ingredientChanges.map((change) => {
                                    if (change.ingredientId === newIngr.id && change.type === "ADD") {
                                        return { type: "ADD", ingredientId: newIngr.id, amount: newIngr.amount, unit: newIngr.unit }
                                    } else if (change.ingredientId === newIngr.id && change.type === "UPDATE") {
                                        return { type: "UPDATE", ingredientId: newIngr.id, amount: newIngr.amount, unit: newIngr.unit }
                                    } else if (change.ingredientId === newIngr.id && change.type === "REMOVE") {
                                        return { type: "UPDATE", ingredientId: newIngr.id, amount: newIngr.amount, unit: newIngr.unit }
                                    }
                                    return change
                                }))
                            } else {
                                setIngredientChanges([...ingredientChanges, { type: "UPDATE", ingredientId: newIngr.id, amount: newIngr.amount, unit: newIngr.unit }])
                            }
                            setChangesStack([...changesStack, { field: "INGREDIENTS", newValue: newIngr, oldValue: oldIngr }])
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

function newChange(field: EditorFields, newValue: any, oldValue: any, recipeState: [RecipeEditData | RecipeCreationData, (p: RecipeEditData | RecipeCreationData) => void], stackState: [{ field: EditorFields, newValue: any, oldValue: any }[], (p: { field: EditorFields, newValue: any, oldValue: any }[]) => void]) {
    stackState[1]([...stackState[0], { field: field, newValue: newValue, oldValue: oldValue }])
    change(field, newValue, recipeState)
}

function changeBack(stackState: [{ field: EditorFields, newValue: any, oldValue: any }[], (p: { field: EditorFields, newValue: any, oldValue: any }[]) => void], recipeState: [RecipeEditData | RecipeCreationData, (p: RecipeEditData | RecipeCreationData) => void], ingredientSelectorRef?: React.RefObject<any>) {
    if (stackState[0].length < 1) return
    let last = stackState[0].pop()
    if (!last) return
    change(last.field, last.field === "INGREDIENTS" ? { new: last.oldValue, old: last.newValue } : last.oldValue, recipeState, ingredientSelectorRef)
    stackState[1](stackState[0])
}

function change(field: EditorFields, newValue: any, recipeState: [RecipeEditData | RecipeCreationData, (p: RecipeEditData | RecipeCreationData) => void], ingredientSelectorRef?: React.RefObject<any>) {
    console.log(field, newValue)
    switch (field) {
        case "IMAGE":
            console.log("IMAGE")
            recipeState[1]({ ...recipeState[0], imageUrl: newValue })
            break
        case "NAME":
            recipeState[1]({ ...recipeState[0], name: newValue })
            break
        case "DESCRIPTION":
            recipeState[1]({ ...recipeState[0], description: newValue })
            break
        case "TYPE":
            recipeState[1]({ ...recipeState[0], typeId: newValue })
            break
        case "COOKINGTIME":
            recipeState[1]({ ...recipeState[0], cookingTime: newValue })
            break
        case "WAITINGTIME":
            recipeState[1]({ ...recipeState[0], waitingTime: newValue })
            break
        case "SERVINGS":
            recipeState[1]({ ...recipeState[0], servings: newValue })
            break
        case "INGREDIENTS":
            if (ingredientSelectorRef) {
                const current = ingredientSelectorRef.current
                if (!current) return
                if (!newValue.new && newValue.old) {
                    current.removeIngredient(newValue.old.id, false)
                } else if (newValue.new && !newValue.old) {
                    current.addIngredient(newValue.new, false)
                } else if (newValue.new && newValue.old) {
                    current.changeIngredient(newValue.new, false)
                }
            }
            break
        case "PUBLIC":
            recipeState[1]({ ...recipeState[0], public: newValue })
            break
    }
}