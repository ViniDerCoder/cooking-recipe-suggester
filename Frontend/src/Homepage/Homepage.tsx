import { useEffect, useState } from 'react';
import '../ColorScheme.css';
import './Homepage.css';
import RecipePreview from './RecipePreview/RecipePreview';
import { SuggestionFullRecipe } from '../../../Backend/src/utils/types/suggestion';
import { getOwnRecipes, getSuggestions } from './homepageLogic';
import { Recipe, RecipeUserData } from '../../../Backend/src/utils/types/recipe';
import { FaPlus } from 'react-icons/fa';
import { basename } from '../App';
import { IoSettings, IoSettingsOutline } from 'react-icons/io5';
import SuggestionSettings from './SuggestionSettings/SuggestionSettings';
import { BiImport } from 'react-icons/bi';



export default function Homepage() {
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState<SuggestionFullRecipe>();
    const [ownRecipes, setOwnRecipes] = useState<{
        userData: RecipeUserData;
        recipe: Recipe;
    }[]>();
    const [settingsHidden, setSettingsHidden] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            const [lSuggestions, lOwnRecipes] = await Promise.all([
                getSuggestions(),
                getOwnRecipes()
            ]);

            if (lSuggestions[0] && typeof lSuggestions[1] !== "string") setSuggestions(lSuggestions[1]);

            if (lOwnRecipes[0] && typeof lOwnRecipes[1] !== "string") setOwnRecipes(lOwnRecipes[1]);

            if(!lSuggestions[0] || !lOwnRecipes[0]) return setLoading(true);

            setLoading(false);
        }
        
        fetchSuggestions();
    }, [])

    return (
        <div className="homepage">
            <SuggestionSettings hidden={settingsHidden} setHidden={setSettingsHidden}/>
            <div className="homepage-header">
                <div className="homepage-header-title"
                    onClick={() => window.location.href = basename + "/"}
                >Home</div>
                <div className="homepage-header-buttons">

                    <div className='homepage-header-buttons-create'
                        onClick={() => { window.location.href = basename + "/recipe/create" }}
                    ><FaPlus size={"2rem"}/></div>
                    <div className="homepage-header-buttons-import" onClick={() => {
                        
                    }}><BiImport size={"2rem"}/></div>
                    <div className='homepage-header-buttons-settings'
                        onClick={() => { setSettingsHidden(false) }}
                    >{settingsHidden ? <IoSettingsOutline size={"2rem"}/> : <IoSettings size={"2rem"}/>}</div>
                </div>
            </div>
            <div className="homepage-content">
                <div className="homepage-content-recipes">
                    {suggestions ? <div className="homepage-content-recipes-section">
                        <div className="homepage-content-recipes-header">Vorschläge</div>
                        <div className="homepage-content-recipes-section-list">
                            {suggestions.morning ? <div className="homepage-content-recipes-section-list-sublist">
                                <div className="homepage-content-recipes-section-list-sublist-header">Morgens</div>
                                <div className="homepage-content-recipes-section-list-sublist-list">
                                    {suggestions.morning.recipes.map((recipe) => <RecipePreview
                                        key={recipe.recipe.id}
                                        imageUrl={recipe.recipe.imageUrl ? recipe.recipe.imageUrl : undefined}
                                        showEditButton={recipe.recipe.createdById === recipe.userData.userId}
                                        rating={recipe.userData.rating ? recipe.userData.rating : undefined}
                                        name={recipe.recipe.name}
                                        recipeId={recipe.recipe.id}
                                    />)}
                                </div>
                            </div> : null}
                            {suggestions.midday ? <div className="homepage-content-recipes-section-list-sublist">
                                <div className="homepage-content-recipes-section-list-sublist-header">Mittags</div>
                                <div className="homepage-content-recipes-section-list-sublist-list">
                                    {suggestions.midday.recipes.map((recipe) => <RecipePreview
                                        key={recipe.recipe.id}
                                        imageUrl={recipe.recipe.imageUrl ? recipe.recipe.imageUrl : undefined}
                                        showEditButton={recipe.recipe.createdById === recipe.userData.userId}
                                        rating={recipe.userData.rating ? recipe.userData.rating : undefined}
                                        name={recipe.recipe.name}
                                        recipeId={recipe.recipe.id}
                                    />)}
                                </div>
                            </div> : null}
                            {suggestions.evening ? <div className="homepage-content-recipes-section-list-sublist">
                                <div className="homepage-content-recipes-section-list-sublist-header">Abends</div>
                                <div className="homepage-content-recipes-section-list-sublist-list">
                                    {suggestions.evening.recipes.map((recipe) => <RecipePreview
                                        key={recipe.recipe.id}
                                        imageUrl={recipe.recipe.imageUrl ? recipe.recipe.imageUrl : undefined}
                                        showEditButton={recipe.recipe.createdById === recipe.userData.userId}
                                        rating={recipe.userData.rating ? recipe.userData.rating : undefined}
                                        name={recipe.recipe.name}
                                        recipeId={recipe.recipe.id}
                                    />)}
                                </div>
                            </div> : null}
                        </div>
                    </div> : null}
                    <div className="homepage-content-recipes-section">
                        <div className="homepage-content-recipes-header">Eigene Rezepte</div>
                        <div className="homepage-content-recipes-section-list" data-wrap={true}>
                            {ownRecipes?.map((recipe) => <RecipePreview
                                key={recipe.recipe.id}
                                imageUrl={recipe.recipe.imageUrl ? recipe.recipe.imageUrl : undefined}
                                showEditButton={true}
                                rating={recipe.userData.rating ? recipe.userData.rating : undefined}
                                name={recipe.recipe.name}
                                recipeId={recipe.recipe.id}
                            />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}