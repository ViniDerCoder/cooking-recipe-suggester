import { useEffect, useState } from 'react';
import '../ColorScheme.css';
import './Homepage.css';
import RecipePreview from './RecipePreview/RecipePreview';
import { SuggestionFullRecipe } from '../../../Backend/src/utils/types/suggestion';
import { getOwnRecipes, getSuggestions } from './homepageLogic';
import { Recipe, RecipeUserData } from '../../../Backend/src/utils/types/recipe';



export default function Homepage() {
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState<SuggestionFullRecipe>();
    const [ownRecipes, setOwnRecipes] = useState<{
        userData: RecipeUserData;
        recipe: Recipe;
    }[]>();

    useEffect(() => {
        const fetchSuggestions = async () => {
            const [lSuggestions, lOwnRecipes] = await Promise.all([
                getSuggestions(),
                getOwnRecipes()
            ]);

            if(lSuggestions[0] && typeof lSuggestions[1] !== "string") setSuggestions(lSuggestions[1]);

            if(lOwnRecipes[0] && typeof lOwnRecipes[1] !== "string") setOwnRecipes(lOwnRecipes[1]);

            setLoading(false);
        }
        fetchSuggestions();
    })
    
    return (
        <div className="homepage">
            <div className="homepage-header">
                <div className="homepage-header-title">Home</div>
                <div></div>
            </div>
            <div className="homepage-content">
                <div className="homepage-content-recipes">
                    <div className="homepage-content-recipes-section">
                        <div className="homepage-content-recipes-header">Vorschläge</div>
                        <div className="homepage-content-recipes-section-list">
                            <RecipePreview name='Käsekuchen' imageUrl='https://www.einfachbacken.de/sites/einfachbacken.de/files/styles/full_width_tablet_4_3/public/2022-04/lotus_cheesecake_2.jpeg?h=4521fff0&itok=M7V3ZxHJ' showEditButton={true} rating={7} recipeId='2302335d-2561-4334-9136-6e383ef53fca' />
                        </div>
                    </div>
                    <div className="homepage-content-recipes-section">
                        <div className="homepage-content-recipes-header">Eigene Rezepte</div>
                        <div className="homepage-content-recipes-own-list"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}