import { forwardRef, useImperativeHandle, useState } from "react";
import { RecipeIngredientUnit } from "../../../../../../Backend/src/utils/types/ingredient";

const IngredientSelector = forwardRef((p: {
    initialIngredients?: { ingredientId: string, unit: RecipeIngredientUnit, amount: number }[],
    onIngredientAdd: (ingredientId: string, unit: RecipeIngredientUnit, amount: number) => void,
    onIngredientRemove: (ingredientId: string) => void,
    onIngredientChange: (ingredientId: string, unit: RecipeIngredientUnit, amount: number) => void,
}, ref) => {
    const [ingredients, setIngredients] = useState(p.initialIngredients ? p.initialIngredients : []);

    useImperativeHandle(ref, () => ({
        getInitialIngredients: () => p.initialIngredients,
        getIngredients: () => ingredients,
        addIngredient: (ingredientId: string, unit: RecipeIngredientUnit, amount: number, fireListener = true) => {
            setIngredients([...ingredients, { ingredientId, unit, amount }]);
            if(fireListener) p.onIngredientAdd(ingredientId, unit, amount);
        },
        removeIngredient: (ingredientId: string, fireListener = true) => {
            setIngredients(ingredients.filter(i => i.ingredientId !== ingredientId));
            if(fireListener) p.onIngredientRemove(ingredientId);
        },
        changeIngredient: (ingredientId: string, unit: RecipeIngredientUnit, amount: number, fireListener = true) => {
            const newIngredients = [...ingredients];
            const index = newIngredients.findIndex(i => i.ingredientId === ingredientId);
            newIngredients[index] = { ingredientId, unit, amount };
            setIngredients(newIngredients);
            if(fireListener) p.onIngredientChange(ingredientId, unit, amount);
        }
    }));

    return (
        <div className="ingredient-selector">

        </div>
    )
})

export default IngredientSelector;