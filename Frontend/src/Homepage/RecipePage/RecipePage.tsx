import './../../ColorScheme.css';
import './RecipePage.css';

import { useEffect, useState } from "react";
import { getIngredientsOfRecipe } from "./recipeLogic";
import { Recipe } from '../../../../Backend/src/utils/types/recipe'
import { FullRecipeIngredient } from '../../../../Backend/src/utils/types/ingredient'
import { FaRegClock } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { LuBean, LuBeanOff, LuFish, LuFishOff, LuMilk, LuMilkOff, LuNut, LuNutOff, LuVegan, LuWheat, LuWheatOff } from "react-icons/lu";
import { TbEgg, TbEggOff, TbMeat, TbMeatOff, TbPlant2, TbPlant2Off } from "react-icons/tb";
import { GiNautilusShell } from "react-icons/gi";


export default function RecipePage(p: { recipeId: string }) {
    const [recipe, setRecipe] = useState<Recipe | null | false>(null);
    const [ingredients, setIngredients] = useState<FullRecipeIngredient[] | null | false>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [servings, setServings] = useState<number | null>(null);

    useEffect(() => {
        const loadRecipe = async () => {
            console.log(p.recipeId)
            const recipe: [boolean, Recipe] = [true, {
                name: "Pfannkuchen",
                description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et e.",
                instructions: ["Instruction 1", "Instruction 2"],
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
        return <div>Loading...</div>;
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
                <div className="recipe-page-name">{recipe.name}</div>
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
                    <FaRegClock style={{
                        alignSelf: "center"
                    }} />
                    <div className="recipe-page-general-ifno-bar-cookingtime">{recipe.cookingTime}min</div>
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
            {allergenes.vegan ? <TbPlant2  color='#7da811' title='Die Zutaten dieses Rezeptes sind vegan'/> : <TbPlant2Off color='#7da811' title='Die Zutaten dieses Rezeptes sind nicht vegan'/>}
            {allergenes.vegetarian ? <TbMeatOff color='#8c0b23' title='Die Zutaten dieses Rezeptes sind vegetarisch'/> : <TbMeat color='#8c0b23' title='Die Zutaten dieses Rezeptes sind nicht vegetarisch'/>}
            {allergenes.glutenFree ? <LuWheatOff color='#cfa646' title='Die Zutaten dieses Rezeptes sind glutenfrei'/> : <LuWheat color='#cfa646' title='Die Zutaten dieses Rezeptes enthalten Gluten'/>}
            {allergenes.dairyFree ? <LuMilkOff color='#f2f2f2' title='Die Zutaten dieses Rezeptes sind milchfrei'/> : <LuMilk color='#f2f2f2' title='Die Zutaten dieses Rezeptes enthalten Milchprodukte'/>}
            {allergenes.eggFree ? <TbEggOff color='#d4d2d2' title='Die Zutaten dieses Rezeptes sind eifrei'/> : <TbEgg color='#d4d2d2' title='Die Zutaten dieses Rezeptes enthalten Eiprodukte'/>}
            {allergenes.nutFree ? <LuNutOff color='#8a4704' title='Die Zutaten dieses Rezeptes sind nussfrei'/> : <LuNut color='#8a4704' title='Die Zutaten dieses Rezeptes enthalten Nüsse'/>}
            {allergenes.fishFree ? <LuFishOff color='#1f85b8' title='Die Zutaten dieses Rezeptes sind fischfrei'/> : <LuFish color='#1f85b8' title='Die Zutaten dieses Rezeptes enthalten Fisch'/>}
            {allergenes.shellfishFree ? <span border-color="#3f4345" className='strikethrough'><GiNautilusShell color='#3f4345' title='Die Zutaten dieses Rezeptes sind schalentierfrei'/></span> : <GiNautilusShell color='#3f4345' title='Die Zutaten dieses Rezeptes enthalten Schalentiere'/>}
            {allergenes.soyFree ? <LuBeanOff color='#b38d12' title='Die Zutaten dieses Rezeptes sind sojafrei'/> : <LuBean color='#b38d12' title='Die Zutaten dieses Rezeptes enthalten Soja'/>}
        </div>
    )
}