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
    onIngredientRemove: (ingr: FullRecipeIngredient) => void,
    onIngredientChange: (newIngr: FullRecipeIngredient, oldIngr: FullRecipeIngredient) => void,
}, ref) => {
    const [ingredients, setIngredients] = useState(p.initialIngredients ? p.initialIngredients : []);
    const [headerDown, setHeaderDown] = useState(false);
    const [visibleElements, setVisibleElements] = useState({ ingredientList: true, filter: true });
    
    useImperativeHandle(ref, () => ({
        getInitialIngredients: () => p.initialIngredients,
        getIngredients: () => ingredients,
        addIngredient: (ingr: FullRecipeIngredient, fireListener = true) => {
            setIngredients([...ingredients, ingr]);
            if(fireListener) p.onIngredientAdd(ingr);
        },
        removeIngredient: (id: string, fireListener = true) => {
            const ingr = ingredients.find(i => i.id === id);
            if(!ingr) return;
            setIngredients(ingredients.filter(i => i.id !== id));
            if(fireListener) p.onIngredientRemove(ingr);
        },
        changeIngredient: (ingr: FullRecipeIngredient, fireListener = true) => {
            const newIngredients = [...ingredients];
            const index = newIngredients.findIndex(i => i.id === ingr.id);
            const oldIngr = JSON.parse(JSON.stringify(newIngredients[index])) as FullRecipeIngredient;
            newIngredients[index] = ingr;
            setIngredients(newIngredients);
            if(fireListener) p.onIngredientChange(ingr, oldIngr);
        }
    }));

    useEffect(() => {
    }, [ingredients]);

    return (
        <div className="ingredient-selector">
            {headerDown ? <div className="ingredient-selector-new-ingredient-list">
                <div className="ingredient-selector-filter">
                    <input type="text" placeholder="Suche"/>
                    <div data-visble={visibleElements.filter}>Filter:</div>
                    <div data-visble={visibleElements.filter}>Vegan</div>
                    <div data-visble={visibleElements.filter}>Vegetarisch</div>
                    <div data-visble={visibleElements.filter}>Glutenfrei</div>
                    <div data-visble={visibleElements.filter}>Ohne Milchprodukte</div>
                    <div data-visble={visibleElements.filter}>Ohne Eiprodukte</div>
                    <div data-visble={visibleElements.filter}>Ohne Nüsse</div>
                    <div data-visble={visibleElements.filter}>Ohne Fisch</div>
                    <div data-visble={visibleElements.filter}>Ohne Schalentiere</div>
                    <div data-visble={visibleElements.filter}>Ohne Soja</div>
                </div>
            </div> : null}
            <div className="ingredient-selector-header" data-down={headerDown}>
                <div className='ingredient-selector-header-title'>Zutaten</div>
                <div className='ingredient-selector-header-plus' onClick={()=> { 
                    if(!headerDown) {
                        setVisibleElements({ ...visibleElements, ingredientList: false })
                        setTimeout(() => setHeaderDown(!headerDown), 400)
                    } else {
                        setHeaderDown(!headerDown)
                        setVisibleElements({ ...visibleElements, ingredientList: false })
                        setTimeout(() => setVisibleElements({ ...visibleElements, ingredientList: true }), 300)
                        
                    }
                    }}>{headerDown ? <RiArrowUpSLine size={"2rem"}/> : <IoIosAdd size={"2rem"}/>}</div>
            </div>
            {!headerDown ? <div className='ingredient-selector-ingredient-list'>
                {ingredients.map(ingr => <div key={ingr.id} className="ingredient-selector-ingredient" data-visible={visibleElements.ingredientList}>
                    <div className="ingredient-selector-ingredient-amount"><input
                            value={ingr.amount}
                            onChange={(e) => {
                                let el = (e.target as HTMLInputElement)
                                if (el.value.length === 0) el.value = "1"
                                if (isNaN(parseInt(el.value))) return
                                if(parseInt(el.value) < 1) el.value = "1"
                                const oldIngr = JSON.parse(JSON.stringify(ingredients.find(i => i.id === ingr.id))) as FullRecipeIngredient;
                                const newIngr = ingredients.find(i => i.id === ingr.id)
                                if(!newIngr) return;
                                setIngredients(ingredients.map(i => i.id === ingr.id ? { ...ingr, amount: parseInt(el.value) } : i));
                                p.onIngredientChange({ ...newIngr, amount: parseInt(el.value) }, oldIngr);
                            }}
                            step={1}
                            type="number"
                        /></div>
                    <div className="ingredient-selector-ingredient-unit">
                        <select
                            onChange={(e) => {
                                const oldIngr = JSON.parse(JSON.stringify(ingredients.find(i => i.id === ingr.id))) as FullRecipeIngredient;
                                const newIngr = ingredients.find(i => i.id === ingr.id)
                                if(!newIngr) return;
                                const newVal = (e.target.value === "undefined" ? undefined : (e.target.value === "null" ? null : e.target.value as RecipeIngredientUnit));
                                setIngredients(ingredients.map(i => i.id === ingr.id ? { ...ingr, unit: newVal } : i));
                                p.onIngredientChange({ ...newIngr, unit: newVal }, oldIngr);
                            }}
                        >
                            {validUnits.map((u, i) => <option selected={ingr.unit === u} key={u ? u : (u === undefined ? "undefined" : "null")} value={u ? u : (u === undefined ? "undefined" : "null")}>{validUnitsName[i]}</option>)}
                        </select>
                    </div>
                    <div className="ingredient-selector-ingredient-name">{ingr.name}</div>
                    <div className="ingredient-selector-ingredient-remove" onClick={() => {
                        setIngredients(ingredients.filter(i => i.id !== ingr.id));
                        p.onIngredientRemove(ingr)
                    }}><FaMinus /></div>
                </div>)}
            </div> : null}
        </div>
    )
})

export default IngredientSelector;