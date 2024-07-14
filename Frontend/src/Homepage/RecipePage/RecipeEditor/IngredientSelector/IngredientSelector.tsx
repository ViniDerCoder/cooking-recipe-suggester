/* eslint-disable react-hooks/exhaustive-deps */
import '../../../../ColorScheme.css';
import './IngredientSelector.css';
import '../../RecipePage.css';

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FullRecipeIngredient, Ingredient, IngredientFilters, IngredientPropertyFilter, RecipeIngredientUnit } from "../../../../../../Backend/src/utils/types/ingredient";
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { RiArrowUpSLine } from "react-icons/ri";
import { getIngredients, validUnits, validUnitsName } from './ingredientSelectorLogic';
import { FaMinus } from 'react-icons/fa';
import { TbEgg, TbEggOff, TbMeat, TbMeatOff, TbPlant2, TbPlant2Off } from 'react-icons/tb';
import { LuBean, LuBeanOff, LuFish, LuFishOff, LuMilk, LuMilkOff, LuNut, LuNutOff, LuWheat, LuWheatOff } from 'react-icons/lu';
import { GiNautilusShell } from 'react-icons/gi';
import { IoInformationCircleOutline } from "react-icons/io5";
import Tooltip from '../../../../Defaults/Tooltip/Tooltip';

const IngredientSelector = forwardRef((p: {
    initialIngredients?: FullRecipeIngredient[],
    onIngredientAdd: (ingr: FullRecipeIngredient) => void,
    onIngredientRemove: (ingr: FullRecipeIngredient) => void,
    onIngredientChange: (newIngr: FullRecipeIngredient, oldIngr: FullRecipeIngredient) => void,
}, ref) => {
    const [ingredients, setIngredients] = useState(p.initialIngredients ? p.initialIngredients : []);
    const [newIngredients, setNewIngredients] = useState<Ingredient[]>([]);
    const [headerDown, setHeaderDown] = useState(false);
    const [visibleElements, setVisibleElements] = useState({ ingredientList: true, filter: true, newIngredientList: true });
    const [filterStates, setFilterStates] = useState({ vegan: 2, vegetarian: 2, glutenFree: 2, dairyFree: 2, nutFree: 2, eggFree: 2, fishFree: 2, shellfishFree: 2, soyFree: 2 });
    const [searchState, setSearchState] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [searches, setSearches] = useState(0);

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
        const fetchIngredients = async (filter: IngredientFilters) => {
            setLoading(true);
            const result = await getIngredients(filter, 12, 0);
            if (result[0] && typeof result[1] !== "string") {
                setNewIngredients(result[1]);
                setLoading(false);
                setTimeout(() => setVisibleElements({ ...visibleElements, newIngredientList: true }), 300);
            } else {
                console.error(result[1]);
            }
        }

        fetchIngredients(([...Object.entries(filterStates).filter((val) => val[1] !== 2).map(([k, v]) => ({ name: k as IngredientPropertyFilter, value: v === 1 }))] as IngredientFilters).concat(searchState ? [{ name: "name", value: searchState }] : []));
    }, [searches]);

    return (
        <div className="ingredient-selector">
            {headerDown ? <div className="ingredient-selector-new-ingredients">
                <div className="ingredient-selector-filter" data-visible={visibleElements.filter}>
                    <input type="text" placeholder="Suche"
                        value={searchState ? searchState : ""}
                        onChange={(e) => {
                            if (e.target.value.length === 0) setSearchState(undefined)
                            else setSearchState(e.target.value)
                        }}
                    />
                    <div className='ingredient-selector-filter-type'>
                        <Tooltip
                            element={<div onClick={() => setFilterStates({ ...filterStates, vegan: filterStates.vegan === 2 ? 0 : filterStates.vegan + 1 })}>{filterStates.vegan === 0 ? <TbPlant2Off color='#7da811' /> : (filterStates.vegan === 1 ? <TbPlant2 color='#7da811' /> : <TbPlant2 color='#7da811' opacity={0.5} />)}</div>}
                            message={filterStates.vegan === 2 ? 'Vegan/Nicht Vegan' : filterStates.vegan === 1 ? 'Vegan' : 'Nicht Vegan'}
                            sx={{ style: { marginTop: "1.5rem", width: "min-content", textWrap: "nowrap" } }}
                        />
                        <Tooltip
                            element={<div onClick={() => setFilterStates({ ...filterStates, vegetarian: filterStates.vegetarian === 2 ? 0 : filterStates.vegetarian + 1 })}>{filterStates.vegetarian === 0 ? <TbMeat color='#8c0b23' /> : (filterStates.vegetarian === 1 ? <TbMeatOff color='#8c0b23' /> : <TbMeatOff color='#8c0b23' opacity={0.5} />)}</div>}
                            message={filterStates.vegetarian === 2 ? 'Vegetarisch/Nicht Vegetarisch' : filterStates.vegetarian === 1 ? 'Vegetarisch' : 'Nicht Vegetarisch'}
                            sx={{ style: { marginTop: "1.5rem", width: "min-content", textWrap: "nowrap" } }}
                        />
                        <Tooltip
                            element={<div onClick={() => setFilterStates({ ...filterStates, glutenFree: filterStates.glutenFree === 2 ? 0 : filterStates.glutenFree + 1 })}>{filterStates.glutenFree === 0 ? <LuWheat color='#cfa646' /> : (filterStates.glutenFree === 1 ? <LuWheatOff color='#cfa646' /> : <LuWheatOff color='#cfa646' opacity={0.5} />)}</div>}
                            message={filterStates.glutenFree === 2 ? 'Glutenfrei/Nicht Glutenfrei' : filterStates.glutenFree === 1 ? 'Glutenfrei' : 'Nicht Glutenfrei'}
                            sx={{ style: { marginTop: "1.5rem", width: "min-content", textWrap: "nowrap" } }}
                        />
                        <Tooltip
                            element={<div onClick={() => setFilterStates({ ...filterStates, dairyFree: filterStates.dairyFree === 2 ? 0 : filterStates.dairyFree + 1 })}>{filterStates.dairyFree === 0 ? <LuMilk color='#f2f2f2' /> : (filterStates.dairyFree === 1 ? <LuMilkOff color='#f2f2f2' /> : <LuMilkOff color='#f2f2f2' opacity={0.5} />)}</div>}
                            message={filterStates.dairyFree === 2 ? 'Milchfrei/Nicht Milchfrei' : filterStates.dairyFree === 1 ? 'Milchfrei' : 'Nicht Milchfrei'}
                            sx={{ style: { marginTop: "1.5rem", width: "min-content", textWrap: "nowrap" } }}
                        />
                        <Tooltip
                            element={<div onClick={() => setFilterStates({ ...filterStates, eggFree: filterStates.eggFree === 2 ? 0 : filterStates.eggFree + 1 })}>{filterStates.eggFree === 0 ? <TbEgg color='#d4d2d2' /> : (filterStates.eggFree === 1 ? <TbEggOff color='#d4d2d2' /> : <TbEggOff color='#d4d2d2' opacity={0.5} />)}</div>}
                            message={filterStates.eggFree === 2 ? 'Eifrei/Nicht Eifrei' : filterStates.eggFree === 1 ? 'Eifrei' : 'Nicht Eifrei'}
                            sx={{ style: { marginTop: "1.5rem", width: "min-content", textWrap: "nowrap" } }}
                        />
                        <Tooltip
                            element={<div onClick={() => setFilterStates({ ...filterStates, nutFree: filterStates.nutFree === 2 ? 0 : filterStates.nutFree + 1 })}>{filterStates.nutFree === 0 ? <LuNut color='#8a4704' /> : (filterStates.nutFree === 1 ? <LuNutOff color='#8a4704' /> : <LuNutOff color='#8a4704' opacity={0.5} />)}</div>}
                            message={filterStates.nutFree === 2 ? 'Nussfrei/Nicht Nussfrei' : filterStates.nutFree === 1 ? 'Nussfrei' : 'Nicht Nussfrei'}
                            sx={{ style: { marginTop: "1.5rem", width: "min-content", textWrap: "nowrap" } }}
                        />
                        <Tooltip
                            element={<div onClick={() => setFilterStates({ ...filterStates, fishFree: filterStates.fishFree === 2 ? 0 : filterStates.fishFree + 1 })}>{filterStates.fishFree === 0 ? <LuFish color='#1f85b8' /> : (filterStates.fishFree === 1 ? <LuFishOff color='#1f85b8' /> : <LuFishOff color='#1f85b8' opacity={0.5} />)}</div>}
                            message={filterStates.fishFree === 2 ? 'Fischfrei/Nicht Fischfrei' : filterStates.fishFree === 1 ? 'Fischfrei' : 'Nicht Fischfrei'}
                            sx={{ style: { marginTop: "1.5rem", width: "min-content", textWrap: "nowrap" } }}
                        />
                        <Tooltip
                            element={<div onClick={() => setFilterStates({ ...filterStates, shellfishFree: filterStates.shellfishFree === 2 ? 0 : filterStates.shellfishFree + 1 })}>{filterStates.shellfishFree === 0 ? <GiNautilusShell color='#3f4345' /> : (filterStates.shellfishFree === 1 ? <span border-color="#3f4345" className='recipe-page-allergies-strikethrough'><GiNautilusShell color='#3f4345' /></span> : <span border-color="#3f4345" className='recipe-page-allergies-strikethrough'><GiNautilusShell color='#3f4345' opacity={0.5} /></span>)}</div>}
                            message={filterStates.shellfishFree === 2 ? 'Schalentierfrei/Nicht Schalentierfrei' : filterStates.shellfishFree === 1 ? 'Schalentierfrei' : 'Nicht Schalentierfrei'}
                            sx={{ style: { marginTop: "1.5rem", width: "min-content", textWrap: "nowrap" } }}
                        />
                        <Tooltip
                            element={<div onClick={() => setFilterStates({ ...filterStates, soyFree: filterStates.soyFree === 2 ? 0 : filterStates.soyFree + 1 })}>{filterStates.soyFree === 0 ? <LuBean color='#b38d12' /> : (filterStates.soyFree === 1 ? <LuBeanOff color='#b38d12' /> : <LuBeanOff color='#b38d12' opacity={0.5} />)}</div>}
                            message={filterStates.soyFree === 2 ? 'Sojafrei/Nicht Sojafrei' : filterStates.soyFree === 1 ? 'Sojafrei' : 'Nicht Sojafrei'}
                            sx={{ style: { marginTop: "1.5rem", width: "min-content", textWrap: "nowrap" } }}
                        />
                    </div>
                    <div className="ingredient-selector-filter-apply" onClick={() => setSearches(searches + 1)}>Suchen</div>
                </div>
                <div className="ingredient-selector-new-ingredients-list">
                    {loading ? <div className="ingredient-selector-new-ingredients-loading">Lade...</div> : newIngredients.map(ingr =>
                        <div key={ingr.id} className="ingredient-selector-new-ingredient" data-visible={visibleElements.newIngredientList}>
                            <div className="ingredient-selector-new-ingredient-name">{ingr.name}</div>
                            <Tooltip
                                element={<div className="ingredient-selector-new-ingredient-info"><IoInformationCircleOutline /></div>}
                                message={<TooltipElementMessage ingr={ingr}/>}
                                sx={{ style: { textWrap: "nowrap", right: "2rem", top: "0.25rem" } }}
                            />
                            <div className="ingredient-selector-new-ingredient-add" onClick={() => {
                                const ingredient = ingredients.find(i => i.id === ingr.id);
                                if (ingredient) {
                                    setIngredients(ingredients.filter(i => i.id !== ingr.id));
                                    p.onIngredientRemove(ingredient);
                                } else {
                                    const newIngr = { id: ingr.id, name: ingr.name, amount: 1, unit: undefined, properties: ingr.properties } as FullRecipeIngredient;
                                    setIngredients([...ingredients, newIngr]);
                                    p.onIngredientAdd(newIngr);
                                }
                            }}>{ingredients.find((val) => val.id === ingr.id) ? <IoIosRemove size={"2rem"} style={{ marginTop: "0.15rem" }} /> : <IoIosAdd size={"2rem"} style={{ marginTop: "0.15rem" }} />}</div>
                        </div>
                    )}
                </div>
            </div> : null}
            <div className="ingredient-selector-header" data-down={headerDown}>
                <div className='ingredient-selector-header-title'>Zutaten</div>
                <div className="ingredient-selector-header-allergenes">
                    <Tooltip
                        element={<div>{ingredients.some((ingr) => !ingr.properties.vegan) ? <TbPlant2Off color='#7da811' /> : <TbPlant2 color='#7da811' />}</div>}
                        message={ingredients.some((ingr) => !ingr.properties.vegan) ? "Nicht Vegan" : "Vegan"}
                        sx={{ style: { textWrap: "nowrap", bottom: headerDown ? "2.5rem" : undefined, top: headerDown ? undefined : "2.5rem" } }}
                    />
                    <Tooltip
                        element={<div>{ingredients.some((ingr) => !ingr.properties.vegetarian) ? <TbMeat color='#8c0b23' /> : <TbMeatOff color='#8c0b23' />}</div>}
                        message={ingredients.some((ingr) => !ingr.properties.vegetarian) ? "Nicht Vegetarisch" : "Vegetarisch"}
                        sx={{ style: { textWrap: "nowrap", bottom: headerDown ? "2.5rem" : undefined, top: headerDown ? undefined : "2.5rem" } }}
                    />
                    <Tooltip
                        element={<div>{ingredients.some((ingr) => !ingr.properties.glutenFree) ? <LuWheat color='#cfa646' /> : <LuWheatOff color='#cfa646' />}</div>}
                        message={ingredients.some((ingr) => !ingr.properties.glutenFree) ? "Nicht Glutenfrei" : "Glutenfrei"}
                        sx={{ style: { textWrap: "nowrap", bottom: headerDown ? "2.5rem" : undefined, top: headerDown ? undefined : "2.5rem" } }}
                    />
                    <Tooltip
                        element={<div>{ingredients.some((ingr) => !ingr.properties.dairyFree) ? <LuMilk color='#f2f2f2' /> : <LuMilkOff color='#f2f2f2' />}</div>}
                        message={ingredients.some((ingr) => !ingr.properties.dairyFree) ? "Nicht Milchfrei" : "Milchfrei"}
                        sx={{ style: { textWrap: "nowrap", bottom: headerDown ? "2.5rem" : undefined, top: headerDown ? undefined : "2.5rem" } }}
                    />
                    <Tooltip
                        element={<div>{ingredients.some((ingr) => !ingr.properties.nutFree) ? <LuNut color='#8a4704' /> : <LuNutOff color='#8a4704' />}</div>}
                        message={ingredients.some((ingr) => !ingr.properties.nutFree) ? "Nicht Nussfrei" : "Nussfrei"}
                        sx={{ style: { textWrap: "nowrap", bottom: headerDown ? "2.5rem" : undefined, top: headerDown ? undefined : "2.5rem" } }}
                    />
                    <Tooltip
                        element={<div>{ingredients.some((ingr) => !ingr.properties.eggFree) ? <TbEgg color='#d4d2d2' /> : <TbEggOff color='#d4d2d2' />}</div>}
                        message={ingredients.some((ingr) => !ingr.properties.eggFree) ? "Nicht Eifrei" : "Eifrei"}
                        sx={{ style: { textWrap: "nowrap", bottom: headerDown ? "2.5rem" : undefined, top: headerDown ? undefined : "2.5rem" } }}
                    />
                    <Tooltip
                        element={<div>{ingredients.some((ingr) => !ingr.properties.fishFree) ? <LuFish color='#1f85b8' /> : <LuFishOff color='#1f85b8' />}</div>}
                        message={ingredients.some((ingr) => !ingr.properties.fishFree) ? "Nicht Fischfrei" : "Fischfrei"}
                        sx={{ style: { textWrap: "nowrap", bottom: headerDown ? "2.5rem" : undefined, top: headerDown ? undefined : "2.5rem" } }}
                    />
                    <Tooltip
                        element={<div>{ingredients.some((ingr) => !ingr.properties.shellfishFree) ? <GiNautilusShell color='#3f4345' /> : <span border-color="#3f4345" className='recipe-page-allergies-strikethrough'><GiNautilusShell color='#3f4345' /></span>}</div>}
                        message={ingredients.some((ingr) => !ingr.properties.shellfishFree) ? "Nicht Schalentierfrei" : "Schalentierfrei"}
                        sx={{ style: { textWrap: "nowrap", bottom: headerDown ? "2.5rem" : undefined, top: headerDown ? undefined : "2.5rem" } }}
                    />
                    <Tooltip
                        element={<div>{ingredients.some((ingr) => !ingr.properties.soyFree) ? <LuBean color='#b38d12' /> : <LuBeanOff color='#b38d12' />}</div>}
                        message={ingredients.some((ingr) => !ingr.properties.soyFree) ? "Nicht Sojafrei" : "Sojafrei"}
                        sx={{ style: { textWrap: "nowrap", bottom: headerDown ? "2.5rem" : undefined, top: headerDown ? undefined : "2.5rem" } }}
                    />
                </div>
                <div className='ingredient-selector-header-plus' onClick={() => {
                    if (!headerDown) {
                        setSearches(searches + 1)
                        setVisibleElements({ ...visibleElements, ingredientList: false, newIngredientList: false })
                        setTimeout(() => {
                            setHeaderDown(!headerDown)
                            setTimeout(() => setVisibleElements({ ...visibleElements, filter: true, newIngredientList: loading ? false : true }), 300)
                        }, 400)
                    } else {
                        setVisibleElements({ ...visibleElements, filter: false, newIngredientList: false })
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
                    <Tooltip
                        element={<div className="ingredient-selector-ingredient-info"><IoInformationCircleOutline size={"1.5rem"} /></div>}
                        message={<TooltipElementMessage ingr={ingr}/>}
                        sx={{ style: { textWrap: "nowrap", right: "-3rem" } }}
                    />
                    <div className="ingredient-selector-ingredient-remove" onClick={() => {
                        setIngredients(ingredients.filter(i => i.id !== ingr.id));
                        p.onIngredientRemove(ingr)
                    }}><FaMinus /></div>
                </div>)}
            </div> : null}
        </div>
    )
})

function TooltipElementMessage(p: {ingr: FullRecipeIngredient | Ingredient}) {
    return (
        <div>
            {p.ingr.properties.vegan ? <TbPlant2 color='#7da811' /> : <TbPlant2Off color='#7da811' />}
            {p.ingr.properties.vegetarian ? <TbMeatOff color='#8c0b23' /> : <TbMeat color='#8c0b23' />}
            {!p.ingr.properties.glutenFree ? <LuWheat color='#cfa646' /> : <LuWheatOff color='#cfa646' />}
            {!p.ingr.properties.dairyFree ? <LuMilk color='#f2f2f2' /> : <LuMilkOff color='#f2f2f2' />}
            {!p.ingr.properties.nutFree ? <LuNut color='#8a4704' /> : <LuNutOff color='#8a4704' />}
            {!p.ingr.properties.eggFree ? <TbEgg color='#d4d2d2' /> : <TbEggOff color='#d4d2d2' />}
            {!p.ingr.properties.fishFree ? <LuFish color='#1f85b8' /> : <LuFishOff color='#1f85b8' />}
            {!p.ingr.properties.shellfishFree ? <GiNautilusShell color='#3f4345' /> : <span border-color="#3f4345" className='recipe-page-allergies-strikethrough'><GiNautilusShell color='#3f4345' /></span>}
            {!p.ingr.properties.soyFree ? <LuBean color='#b38d12' /> : <LuBeanOff color='#b38d12' />}
        </div>
        )
    return (
        <div>
            {(p.ingr.properties.vegan ? 'Vegan' : 'Nicht Vegan')} <br />
            {(p.ingr.properties.vegetarian ? 'Vegetarisch' : 'Nicht Vegetarisch')} <br />
            {(p.ingr.properties.glutenFree ? 'Glutenfrei' : 'Nicht Glutenfrei')} <br />
            {(p.ingr.properties.dairyFree ? 'Milchfrei' : 'Nicht Milchfrei')} <br />
            {(p.ingr.properties.nutFree ? 'Nussfrei' : 'Nicht Nussfrei')} <br />
            {(p.ingr.properties.eggFree ? 'Eifrei' : 'Nicht Eifrei')} <br />
            {(p.ingr.properties.fishFree ? 'Fischfrei' : 'Nicht Fischfrei')} <br />
            {(p.ingr.properties.shellfishFree ? 'Schalentierfrei' : 'Nicht Schalentierfrei')} <br />
            {(p.ingr.properties.soyFree ? 'Sojafrei' : 'Nicht Sojafrei')} <br />
        </div>
    )
}

export default IngredientSelector;