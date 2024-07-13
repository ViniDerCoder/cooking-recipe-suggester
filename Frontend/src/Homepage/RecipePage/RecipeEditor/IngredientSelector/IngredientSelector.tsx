import '../../../../ColorScheme.css';
import './IngredientSelector.css';
import '../../RecipePage.css';

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FullRecipeIngredient, IngredientFilters, IngredientPropertyFilter, RecipeIngredientUnit } from "../../../../../../Backend/src/utils/types/ingredient";
import { IoIosAdd } from 'react-icons/io';
import { RiArrowUpSLine } from "react-icons/ri";
import { validUnits, validUnitsName } from './ingredientSelectorLogic';
import { FaMinus } from 'react-icons/fa';
import { TbEgg, TbEggOff, TbMeat, TbMeatOff, TbPlant2, TbPlant2Off } from 'react-icons/tb';
import { LuBean, LuBeanOff, LuFish, LuFishOff, LuMilk, LuMilkOff, LuNut, LuNutOff, LuWheat, LuWheatOff } from 'react-icons/lu';
import { GiNautilusShell } from 'react-icons/gi';

const IngredientSelector = forwardRef((p: {
    initialIngredients?: FullRecipeIngredient[],
    onIngredientAdd: (ingr: FullRecipeIngredient) => void,
    onIngredientRemove: (ingr: FullRecipeIngredient) => void,
    onIngredientChange: (newIngr: FullRecipeIngredient, oldIngr: FullRecipeIngredient) => void,
}, ref) => {
    const [ingredients, setIngredients] = useState(p.initialIngredients ? p.initialIngredients : []);
    const [headerDown, setHeaderDown] = useState(false);
    const [visibleElements, setVisibleElements] = useState({ ingredientList: true, filter: true });
    const [filterStates, setFilterStates] = useState({ vegan: 2, vegetarian: 2, glutenFree: 2, dairyFree: 2, nutFree: 2, eggFree: 2, fishFree: 2, shellfishFree: 2, soyFree: 2 });
    const [searchState, setSearchState] = useState<string | undefined> (undefined);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        getInitialIngredients: () => p.initialIngredients,
        getIngredients: () => ingredients,
        addIngredient: (ingr: FullRecipeIngredient, fireListener = true) => {
            setIngredients([...ingredients, ingr]);
            if (fireListener) p.onIngredientAdd(ingr);
        },
        removeIngredient: (id: string, fireListener = true) => {
            const ingr = ingredients.find(i => i.id === id);
            if (!ingr) return;
            setIngredients(ingredients.filter(i => i.id !== id));
            if (fireListener) p.onIngredientRemove(ingr);
        },
        changeIngredient: (ingr: FullRecipeIngredient, fireListener = true) => {
            const newIngredients = [...ingredients];
            const index = newIngredients.findIndex(i => i.id === ingr.id);
            const oldIngr = JSON.parse(JSON.stringify(newIngredients[index])) as FullRecipeIngredient;
            newIngredients[index] = ingr;
            setIngredients(newIngredients);
            if (fireListener) p.onIngredientChange(ingr, oldIngr);
        }
    }));

    useEffect(() => {
        const fetchIngredients = async (filter: IngredientFilters, p: number) => {
            setLoading(true);
            
            setLoading(false);
        }

        fetchIngredients(([...Object.entries(filterStates).filter((val) => val[1] !== 2).map(([k, v]) => ({ name: k as IngredientPropertyFilter, value: v === 1 }))] as IngredientFilters).concat(searchState ? [{ name: "name", value: searchState }] : []), page);
    }, [filterStates, searchState, page]);

    return (
        <div className="ingredient-selector">
            {headerDown ? <div className="ingredient-selector-new-ingredients">
                <div className="ingredient-selector-filter" data-visible={visibleElements.filter}>
                    <input type="text" placeholder="Suche" 
                        onChange={(e) => {
                            if(e.target.value.length === 0) setSearchState(undefined)
                            else setSearchState(e.target.value)
                        }}
                    />
                    <div className='ingredient-selector-filter-type'>
                        <div onClick={() => setFilterStates({...filterStates, vegan: filterStates.vegan === 2 ? 0 : filterStates.vegan + 1})}>{filterStates.vegan === 0 ? <TbPlant2Off color='#7da811' /> : (filterStates.vegan === 1 ? <TbPlant2 color='#7da811' /> : <TbPlant2 color='#7da811' opacity={0.5} />)}</div>
                        <div onClick={() => setFilterStates({...filterStates, vegetarian: filterStates.vegetarian === 2 ? 0 : filterStates.vegetarian + 1})}>{filterStates.vegetarian === 0 ? <TbMeat color='#8c0b23' /> : (filterStates.vegetarian === 1 ? <TbMeatOff color='#8c0b23' /> : <TbMeatOff color='#8c0b23' opacity={0.5} />)}</div>
                        <div onClick={() => setFilterStates({...filterStates, glutenFree: filterStates.glutenFree === 2 ? 0 : filterStates.glutenFree + 1})}>{filterStates.glutenFree === 0 ? <LuWheat color='#cfa646' /> : (filterStates.glutenFree === 1 ? <LuWheatOff color='#cfa646' /> : <LuWheatOff color='#cfa646' opacity={0.5} />)}</div>
                        <div onClick={() => setFilterStates({...filterStates, dairyFree: filterStates.dairyFree === 2 ? 0 : filterStates.dairyFree + 1})}>{filterStates.dairyFree === 0 ? <LuMilk color='#f2f2f2' /> : (filterStates.dairyFree === 1 ? <LuMilkOff color='#f2f2f2' /> : <LuMilkOff color='#f2f2f2' opacity={0.5} />)}</div>
                        <div onClick={() => setFilterStates({...filterStates, eggFree: filterStates.eggFree === 2 ? 0 : filterStates.eggFree + 1})}>{filterStates.eggFree === 0 ? <TbEgg color='#d4d2d2' /> : (filterStates.eggFree === 1 ? <TbEggOff color='#d4d2d2' /> : <TbEggOff color='#d4d2d2' opacity={0.5} />)}</div>
                        <div onClick={() => setFilterStates({...filterStates, nutFree: filterStates.nutFree === 2 ? 0 : filterStates.nutFree + 1})}>{filterStates.nutFree === 0 ? <LuNut color='#8a4704' /> : (filterStates.nutFree === 1 ? <LuNutOff color='#8a4704' /> : <LuNutOff color='#8a4704' opacity={0.5} />)}</div>
                        <div onClick={() => setFilterStates({...filterStates, fishFree: filterStates.fishFree === 2 ? 0 : filterStates.fishFree + 1})}>{filterStates.fishFree === 0 ? <LuFish color='#1f85b8' />: (filterStates.fishFree === 1 ? <LuFishOff color='#1f85b8' /> : <LuFishOff color='#1f85b8' opacity={0.5} />)}</div>
                        <div onClick={() => setFilterStates({...filterStates, shellfishFree: filterStates.shellfishFree === 2 ? 0 : filterStates.shellfishFree + 1})}>{filterStates.shellfishFree === 0 ? <GiNautilusShell color='#3f4345' /> : (filterStates.shellfishFree === 1 ? <span border-color="#3f4345" className='recipe-page-allergies-strikethrough'><GiNautilusShell color='#3f4345' /></span> : <span border-color="#3f4345" className='recipe-page-allergies-strikethrough'><GiNautilusShell color='#3f4345' opacity={0.5} /></span>)}</div>
                        <div onClick={() => setFilterStates({...filterStates, soyFree: filterStates.soyFree === 2 ? 0 : filterStates.soyFree + 1})}>{filterStates.soyFree === 0 ? <LuBean color='#b38d12' /> : (filterStates.soyFree === 1 ? <LuBeanOff color='#b38d12' /> : <LuBeanOff color='#b38d12' opacity={0.5} />)}</div>
                    </div>
                    <div className="ingredient-selector-filter-apply">Suchen</div>
                </div>
                <div className="ingredient-selector-new-ingridients-list">
                    {loading ? <div className="ingredient-selector-new-ingredients-loading">Lade...</div> : null}
                </div>
            </div> : null}
            <div className="ingredient-selector-header" data-down={headerDown}>
                <div className='ingredient-selector-header-title'>Zutaten</div>
                <div className='ingredient-selector-header-plus' onClick={() => {
                    if (!headerDown) {
                        setVisibleElements({ ...visibleElements, ingredientList: false })
                        setTimeout(() => setHeaderDown(!headerDown), 400)
                    } else {
                        setVisibleElements({ ...visibleElements, filter: false })
                        setTimeout(() => {
                            setHeaderDown(!headerDown)
                            setVisibleElements({ ...visibleElements, ingredientList: false })
                            setTimeout(() => setVisibleElements({ ...visibleElements, ingredientList: true }), 300)
                        }, 400)

                    }
                }}>{headerDown ? <RiArrowUpSLine size={"2rem"} /> : <IoIosAdd size={"2rem"} />}</div>
            </div>
            {!headerDown ? <div className='ingredient-selector-ingredient-list'>
                {ingredients.map(ingr => <div key={ingr.id} className="ingredient-selector-ingredient" data-visible={visibleElements.ingredientList}>
                    <div className="ingredient-selector-ingredient-amount"><input
                        value={ingr.amount}
                        onChange={(e) => {
                            let el = (e.target as HTMLInputElement)
                            if (el.value.length === 0) el.value = "1"
                            if (isNaN(parseInt(el.value))) return
                            if (parseInt(el.value) < 1) el.value = "1"
                            const oldIngr = JSON.parse(JSON.stringify(ingredients.find(i => i.id === ingr.id))) as FullRecipeIngredient;
                            const newIngr = ingredients.find(i => i.id === ingr.id)
                            if (!newIngr) return;
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
                                if (!newIngr) return;
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