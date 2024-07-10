import './../../ColorScheme.css';
import './RecipePage.css';

import { useEffect, useState } from "react";
import { getIngredientsOfRecipe } from "./recipeLogic";
import { Recipe } from '../../../../Backend/src/utils/types/recipe'
import { IngredientRecipeData } from '../../../../Backend/src/utils/types/ingredient'
import { FaRegClock } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";


export default function RecipePage(p: { recipeId: string }) {
    const [recipe, setRecipe] = useState<Recipe | null | false>(null);
    const [ingredients, setIngredients] = useState<IngredientRecipeData[] | null | false>(null);
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
                else setIngredients([{ id: "sdwass", amount: 1, unit: 'milliliter' }, { id: "sugar", amount: 2, unit: 'gram' }, { id: "flour", amount: 3, unit: 'gram' }, { id: "eggs", amount: 4, unit: undefined }]);

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
                                <div className='recipe-page-ingredients-list-item-name'>{ingredient.id}</div>
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
                </div>
                <div className='recipe-page-instructions'>{recipe.instructions.map((instr, index) => {
                    return <div className='recipe-page-instructions-item'>{index + 1}. {instr}</div>
                })}</div>
            </div>
        </div>
    )
}