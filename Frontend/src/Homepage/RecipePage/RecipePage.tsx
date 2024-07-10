import './../../ColorScheme.css';
import './RecipePage.css';

import { useEffect, useState } from "react";
import { getIngredientsOfRecipe } from "./recipeLogic";
import { Recipe } from '../../../../Backend/src/utils/types/recipe'
import { FullRecipeIngredient } from '../../../../Backend/src/utils/types/ingredient'

import { FiMinus, FiPlus } from "react-icons/fi";
import { LuBean, LuBeanOff, LuFish, LuFishOff, LuMilk, LuMilkOff, LuNut, LuNutOff, LuWheat, LuWheatOff } from "react-icons/lu";
import { TbClockHour4, TbClockPause, TbEgg, TbEggOff, TbMeat, TbMeatOff, TbPlant2, TbPlant2Off } from "react-icons/tb";
import { GiNautilusShell } from "react-icons/gi";
import { BiDish, BiSolidDish } from "react-icons/bi";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";


export default function RecipePage(p: { recipeId: string }) {
    const [recipe, setRecipe] = useState<Recipe | null | false>(null);
    const [ingredients, setIngredients] = useState<FullRecipeIngredient[] | null | false>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [servings, setServings] = useState<number | null>(null);
    const [isRecipeMarked, setIsRecipeMarked] = useState(false);
    const [recipeCooked, setRecipeCooked] = useState(false);

    useEffect(() => {
        const loadRecipe = async () => {
            console.log(p.recipeId)
            const recipe: [boolean, Recipe] = [true, {
                name: "Pfannkuchen",
                description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et e.",
                instructions: ["Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam"],
                imageUrl: "https://img.chefkoch-cdn.de/rezepte/2529831396465550/bilder/1509532/crop-960x540/pfannkuchen-crepe-und-pancake.jpg",
                id: p.recipeId,
                createdAt: new Date(),
                createdById: "someId",
                waitingTime: 111,
                servings: 2,
                cookingTime: 22,
                public: true,
                typeId: "someId"
            } as Recipe];
            if (recipe[0]) {
                const ingredients = await getIngredientsOfRecipe(recipe[1].id);
                if (ingredients[0]) setIngredients(ingredients[1]);
                else setIngredients([{ id: "2704362r7n073cr20d9jr20ds3", amount: 1, unit: 'milliliter', name: "milk", properties: {
                    vegan: false,
                    vegetarian: true,
                    glutenFree: true,
                    dairyFree: false,
                    eggFree: true,
                    nutFree: true,
                    soyFree: true,
                    fishFree: true,
                    shellfishFree: true,
                } }, { id: "2134718nfwe983mr1302xc76r0j4d2r02kd", amount: 2, unit: 'gram', name: "sugar", properties: {
                    vegan: true,
                    vegetarian: true,
                    glutenFree: true,
                    dairyFree: true,
                    eggFree: true,
                    nutFree: true,
                    soyFree: true,
                    fishFree: true,
                    shellfishFree: true,
                } }, { id: "239vr7n29vrm0c702cr234cr", amount: 3, unit: 'gram', name: "flour", properties: {
                    vegan: true,
                    vegetarian: true,
                    glutenFree: false,
                    dairyFree: true,
                    eggFree: true,
                    nutFree: true,
                    soyFree: true,
                    fishFree: true,
                    shellfishFree: true,
                }}, { id: "eggffz32cr7240rc972rßx2s", amount: 4, unit: undefined, name: "eggs", properties: {
                    vegan: false,
                    vegetarian: true,
                    glutenFree: true,
                    dairyFree: true,
                    eggFree: false,
                    nutFree: true,
                    soyFree: true,
                    fishFree: true,
                    shellfishFree: true,
                }}]);

                setRecipe(recipe[1]);
                setServings(recipe[1].servings);
            }
            else setRecipe(false);

            setIsLoading(false);
        };

        loadRecipe();
    }, [p.recipeId]);

    if (isLoading) {
        return (
            <div className="recipe-page">
            <div className="recipe-page-left">
                <div className="recipe-page-title-bar">
                </div>
                <div className="recipe-page-ingredients">
                    <div className="recipe-page-ingredients-servings">
                        <div className="recipe-page-ingredients-servings-change">
                        </div>
                    </div>
                    <div className="recipe-page-ingredients-list">
                    </div>
                </div>
            </div>
            <div className="recipe-page-right">
                <div className="recipe-page-general-info-bar">
                    <TbClockHour4 style={{
                        alignSelf: "center"
                    }} />
                    <div className="recipe-page-general-info-bar-time">~min</div>
                    <TbClockPause style={{
                        alignSelf: "center"
                    }} />
                    <div className="recipe-page-general-info-bar-time">~min</div>
                </div>
                <div className='recipe-page-instructions'></div>
            </div>
        </div>
        )
    }

    if (recipe === false || recipe === null) {
        return <div>Recipe not found</div>
    }

    if (ingredients === false || ingredients === null) {
        return <div>Ingredients not loaded</div>
    }

    const recipeDataServings = recipe.servings;

    return (
        <div className="recipe-page">
            <div className="recipe-page-left">
                {recipe.imageUrl ? <img src={recipe.imageUrl} alt={recipe.name} className="recipe-page-image" /> : null}
                <div className="recipe-page-title-bar">
                    <div className="recipe-page-mark"
                        onClick={() => setIsRecipeMarked(!isRecipeMarked)}
                    >{isRecipeMarked ? <GoBookmarkFill /> : <GoBookmark />}</div>
                    <div className="recipe-page-name">{recipe.name}</div>
                    <div className="recipe-page-cooked">{recipeCooked ? <BiSolidDish /> : <BiDish />}</div>
                </div>
                <div className="recipe-page-description">{recipe.description}</div>
                <div className="recipe-page-ingredients">
                    <div className="recipe-page-ingredients-title">Zutaten</div>
                    <div className="recipe-page-ingredients-servings">
                        <div className="recipe-page-ingredients-servings-amount">für {servings}</div>
                        <div className="recipe-page-ingredients-servings-change">
                            <FiPlus style={{userSelect:"none"}} onClick={() => setServings( servings ? servings + 1 : 0)}/>
                            <FiMinus style={{userSelect:"none"}} onClick={() => setServings( servings ? servings > 1 ? servings - 1 : 1 : 0)}/>
                        </div>
                    </div>
                    <div className="recipe-page-ingredients-list">
                        {ingredients.map((ingredient) => {
                            return <div className="recipe-page-ingredients-list-item">
                                <div className='recipe-page-ingredients-list-item-amount'>{(Math.round(ingredient.amount / recipeDataServings * (servings ? servings : recipeDataServings) * 100) / 100) + " "}{ingredient.unit}</div>
                                <div className='recipe-page-ingredients-list-item-name'>{ingredient.name}</div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <div className="recipe-page-right">
                <div className="recipe-page-general-info-bar">
                    <TbClockHour4 style={{
                        alignSelf: "center"
                    }} />
                    <div className="recipe-page-general-info-bar-time">{recipe.cookingTime}min</div>
                    <TbClockPause style={{
                        alignSelf: "center"
                    }} />
                    <div className="recipe-page-general-info-bar-time">{recipe.waitingTime}min</div>
                    <Allergenes ingredients={ingredients}/>
                </div>
                <div className='recipe-page-instructions'>{recipe.instructions.map((instr, index) => {
                    return <div className='recipe-page-instructions-item'>{index + 1}. {instr}</div>
                })}</div>
            </div>
        </div>
    )
}

function Allergenes(p: {ingredients: FullRecipeIngredient[]}) {
    const allergenes = {
        vegan: true,
        vegetarian: true,
        glutenFree: true,
        dairyFree: true,
        eggFree: true,
        nutFree: true,
        soyFree: true,
        fishFree: true,
        shellfishFree: true,
    }
    p.ingredients.forEach(ingredient => {
        if(!ingredient.properties.vegan) allergenes.vegan = false;
        if(!ingredient.properties.vegetarian) allergenes.vegetarian = false;
        if(!ingredient.properties.glutenFree) allergenes.glutenFree = false;
        if(!ingredient.properties.dairyFree) allergenes.dairyFree = false;
        if(!ingredient.properties.eggFree) allergenes.eggFree = false;
        if(!ingredient.properties.nutFree) allergenes.nutFree = false;
        if(!ingredient.properties.fishFree) allergenes.fishFree = false;
        if(!ingredient.properties.shellfishFree) allergenes.shellfishFree = false;
        if(!ingredient.properties.soyFree) allergenes.soyFree = false;
    })
    return (
        <div className="recipe-page-allergies">
            <Allergene 
                allergene={allergenes.vegan}
                trueElement={<TbPlant2  color='#7da811' />}
                falseElement={<TbPlant2Off color='#7da811'/>}
                trueTitle='Die Zutaten dieses Rezeptes sind Vegan'
                falseTitle='Die Zutaten dieses Rezeptes sind nicht Vegan'
            />
            <Allergene 
                allergene={allergenes.vegetarian}
                trueElement={<TbMeatOff color='#8c0b23'/>}
                falseElement={<TbMeat color='#8c0b23'/>}
                trueTitle='Die Zutaten dieses Rezeptes sind Vegetarisch'
                falseTitle='Die Zutaten dieses Rezeptes sind nicht vegetarisch'
            />
            <Allergene
                allergene={allergenes.glutenFree}
                trueElement={<LuWheatOff color='#cfa646'/>}
                falseElement={<LuWheat color='#cfa646'/>}
                trueTitle='Die Zutaten dieses Rezeptes enthalten kein Gluten'
                falseTitle='Die Zutaten dieses Rezeptes enthalten Gluten'
            />
            <Allergene
                allergene={allergenes.dairyFree}
                trueElement={<LuMilkOff color='#f2f2f2'/>}
                falseElement={<LuMilk color='#f2f2f2'/>}
                trueTitle='Die Zutaten dieses Rezeptes enthalten keine Milchprodukte'
                falseTitle='Die Zutaten dieses Rezeptes enthalten Milchprodukte'
            />
            <Allergene
                allergene={allergenes.eggFree}
                trueElement={<TbEggOff color='#d4d2d2'/>}
                falseElement={<TbEgg color='#d4d2d2'/>}
                trueTitle='Die Zutaten dieses Rezeptes enthalten keine Eiprodukte'
                falseTitle='Die Zutaten dieses Rezeptes enthalten Eiprodukte'
            />
            <Allergene
                allergene={allergenes.nutFree}
                trueElement={<LuNutOff color='#8a4704'/>}
                falseElement={<LuNut color='#8a4704'/>}
                trueTitle='Die Zutaten dieses Rezeptes enthalten keine Nüsse'
                falseTitle='Die Zutaten dieses Rezeptes enthalten Nüsse'
            />
            <Allergene
                allergene={allergenes.fishFree}
                trueElement={<LuFishOff color='#1f85b8'/>}
                falseElement={<LuFish color='#1f85b8'/>}
                trueTitle='Die Zutaten dieses Rezeptes enthalten kein Fisch'
                falseTitle='Die Zutaten dieses Rezeptes enthalten Fisch'
            />
            <Allergene
                allergene={allergenes.shellfishFree}
                trueElement={<span border-color="#3f4345" className='recipe-page-allergies-strikethrough'><GiNautilusShell color='#3f4345'/></span>}
                falseElement={<GiNautilusShell color='#3f4345'/>}
                trueTitle='Die Zutaten dieses Rezeptes enthalten keine Schalentiere'
                falseTitle='Die Zutaten dieses Rezeptes enthalten Schalentiere'
            />
            <Allergene
                allergene={allergenes.soyFree}
                trueElement={<LuBeanOff color='#b38d12'/>}
                falseElement={<LuBean color='#b38d12'/>}
                trueTitle='Die Zutaten dieses Rezeptes enthalten kein Soja'
                falseTitle='Die Zutaten dieses Rezeptes enthalten Soja'
            />
        </div>
    )
}

function Allergene(p: {allergene: boolean, trueElement: JSX.Element, falseElement: JSX.Element, trueTitle: string, falseTitle: string}) {
    const [visibleTooltip, setVisibleTooltip] = useState(false)
    return (
        <div>
            <div
                onTouchStart={() => setVisibleTooltip(true)}
                onTouchEnd={() => setVisibleTooltip(false)}
                onMouseEnter={() => setVisibleTooltip(true)}
                onMouseLeave={() => setVisibleTooltip(false)}
                onTouchCancel={() => setVisibleTooltip(false)}
            >{p.allergene ? p.trueElement : p.falseElement}</div>
            {visibleTooltip ? <div className='recipe-page-allergies-tooltip'>{p.allergene ? p.trueTitle : p.falseTitle}</div> : null}
        </div>
    )
}