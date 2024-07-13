import '../../../../ColorScheme.css';
import './IngredientSelector.css';

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FullRecipeIngredient, RecipeIngredientUnit } from "../../../../../../Backend/src/utils/types/ingredient";
import { IoIosAdd } from 'react-icons/io';
import { RiArrowUpSLine } from "react-icons/ri";
import { validUnits, validUnitsName } from './ingredientSelectorLogic';
import { FaMinus } from 'react-icons/fa';

const IngredientSelector = forwardRef((p: {
    initialIngredients?: FullRecipeIngredient[],
    onIngredientAdd: (ingr: FullRecipeIngredient) => void,
    onIngredientRemove: (id: string) => void,
    onIngredientChange: (ingr: FullRecipeIngredient) => void,
}, ref) => {
    const [ingredients, setIngredients] = useState(p.initialIngredients ? p.initialIngredients : [{ properties: {}, name: "t", id: '', unit: 'gram' as RecipeIngredientUnit, amount: 0 }]);
    const [headerDown, setHeaderDown] = useState(false);
    
    useImperativeHandle(ref, () => ({
        getInitialIngredients: () => p.initialIngredients,
        getIngredients: () => ingredients,
        addIngredient: (ingr: FullRecipeIngredient, fireListener = true) => {
            setIngredients([...ingredients, ingr]);
            if(fireListener) p.onIngredientAdd(ingr);
        },
        removeIngredient: (id: string, fireListener = true) => {
            setIngredients(ingredients.filter(i => i.id !== id));
            if(fireListener) p.onIngredientRemove(id);
        },
        changeIngredient: (ingr: FullRecipeIngredient, fireListener = true) => {
            const newIngredients = [...ingredients];
            const index = newIngredients.findIndex(i => i.id === ingr.id);
            newIngredients[index] = ingr;
            setIngredients(newIngredients);
            if(fireListener) p.onIngredientChange(ingr);
        }
    }));

    useEffect(() => {
    }, [ingredients]);

    return (
        <div className="ingredient-selector">
            {headerDown ? <div className="ingredient-selector-new-ingredient-list" data-down={headerDown} onClick={() => setHeaderDown(!headerDown)}>

            </div> : null}
            <div className="ingredient-selector-header" data-down={headerDown}>
                <div className='ingredient-selector-header-title'>Zutaten</div>
                <div className='ingredient-selector-header-plus' onClick={()=> { setHeaderDown(!headerDown)}}>{headerDown ? <RiArrowUpSLine size={"2rem"}/> : <IoIosAdd size={"2rem"}/>}</div>
            </div>
            {!headerDown ? <div className='ingredient-selector-ingredient-list'>
                {ingredients.map(ingr => <div key={ingr.id} className="ingredient-selector-ingredient">
                    <div className="ingredient-selector-ingredient-amount">{ingr.amount}</div>
                    <div className="ingredient-selector-ingredient-unit">
                        <select>
                            {validUnits.map((u, i) => <option selected={ingr.unit === u} key={u ? u : (u === undefined ? "undefined" : "null")}>{validUnitsName[i]}</option>)}
                        </select>
                    </div>
                    <div className="ingredient-selector-ingredient-name">{ingr.name}</div>
                    <div className="ingredient-selector-ingredient-remove" onClick={() => p.onIngredientRemove(ingr.id)}><FaMinus /></div>
                </div>)}
            </div> : null}
        </div>
    )
})

export default IngredientSelector;