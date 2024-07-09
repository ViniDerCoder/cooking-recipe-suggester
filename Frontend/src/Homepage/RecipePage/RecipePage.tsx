import './../../ColorScheme.css';
import './RecipePage.css';

import { useEffect, useState } from "react";
import { getIngredientsOfRecipe } from "./recipeLogic";
import { Recipe } from '../../../../Backend/src/utils/types/recipe'
import { IngredientRecipeData } from '../../../../Backend/src/utils/types/ingredient'


export default function RecipePage(p: { recipeId: string }) {
    const [recipe, setRecipe] = useState<Recipe | null | false>(null);
    const [ingredients, setIngredients] = useState<IngredientRecipeData[] | null | false>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadRecipe = async () => {
            console.log(p.recipeId)
            const recipe: [boolean, Recipe] = [true, {
                name: "Pfannkuchen",
                description: "Leckere Pfannkuchen süß und herzhaft gefüllt.",
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
                else setIngredients([{ id: "sdwass", amount: 0, unit: 'some' }]);

                setRecipe(recipe[1]);
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

    return (
        <div className="recipe-page">
            <div className="recipe-page-left">
                {recipe.imageUrl ? <img src={recipe.imageUrl} alt={recipe.name} className="recipe-page-image" /> : null}
                <h1 className="recipe-page-name">{recipe.name}</h1>
                <p className="recipe-page-description">{recipe.description}</p>
                <div className="recipe-page-ingredients">
                    <h2 className="recipe-page-ingredients-title">Ingredients</h2>
                    <ul className="recipe-page-ingredients-list">
                        {ingredients.map((ingredient) => {
                            return <li className="recipe-page-ingredients-list-item">{ingredient.amount} {ingredient.unit ? ingredient.unit : ''} of {ingredient.id}</li>
                        })}
                    </ul>
                </div>
            </div>
            <div className='recipe-page-instructions'>{recipe.instructions.map((instr, index) => {
                return <p>{index + 1}. {instr}</p>
            })}</div>
        </div>
    )
}