import '../../../../ColorScheme.css';
import './IngredientSelector.css';

import { forwardRef, useImperativeHandle, useState } from "react";
import { RecipeIngredientUnit } from "../../../../../../Backend/src/utils/types/ingredient";
import { IoIosAdd } from 'react-icons/io';
import { RiArrowUpSLine } from "react-icons/ri";

const IngredientSelector = forwardRef((p: {
    initialIngredients?: { ingredientId: string, unit: RecipeIngredientUnit, amount: number }[],
    onIngredientAdd: (ingredientId: string, unit: RecipeIngredientUnit, amount: number) => void,
    onIngredientRemove: (ingredientId: string) => void,
    onIngredientChange: (ingredientId: string, unit: RecipeIngredientUnit, amount: number) => void,
}, ref) => {
    const [ingredients, setIngredients] = useState(p.initialIngredients ? p.initialIngredients : [{ ingredientId: '', unit: 'gram' as RecipeIngredientUnit, amount: 0 }]);
    const [headerDown, setHeaderDown] = useState(true);

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
            {headerDown ? <div className="ingredient-selector-new-ingredient-list" data-down={headerDown} onClick={() => setHeaderDown(!headerDown)}>

            </div> : null}
            <div className="ingredient-selector-header" data-down={headerDown}>
                <div className='ingredient-selector-header-title'>Zutaten</div>
                <div className='ingredient-selector-header-plus' onClick={()=> { setHeaderDown(!headerDown)}}>{headerDown ? <RiArrowUpSLine size={"2rem"}/> : <IoIosAdd size={"2rem"}/>}</div>
            </div>
            {!headerDown ? <div className='ingredient-selector-ingredient-list'>
                {ingredients.map(i => <div key={i.ingredientId} className="ingredient-selector-ingredient">
                    <div className="ingredient-selector-ingredient-amount">{i.amount}</div>
                    <div className="ingredient-selector-ingredient-unit">{i.unit}</div>
                    <div className="ingredient-selector-ingredient-name">{i.ingredientId}</div>
                </div>)}
            </div> : null}
        </div>
    )
})

export default IngredientSelector;