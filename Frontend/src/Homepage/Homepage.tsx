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

            if (lSuggestions[0] && typeof lSuggestions[1] !== "string") setSuggestions(lSuggestions[1]);

            if (lOwnRecipes[0] && typeof lOwnRecipes[1] !== "string") setOwnRecipes(lOwnRecipes[1]);

            setLoading(false);
        }
        setSuggestions({morning:{recipes:[{recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"},userData:{userId:"1",rating:5}},{recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"},userData:{userId:"1",rating:5}},{recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"},userData:{userId:"1",rating:5}},{recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"},userData:{userId:"1",rating:5}}]},midday:{recipes:[{recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"},userData:{userId:"1",rating:5,}},{recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"},userData:{userId:"1",rating:5}},{recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"},userData:{userId:"1",rating:5}},{recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"},userData:{userId:"1",rating:5}}]},evening:{recipes:[{recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"},userData:{userId:"1",rating:5}},{recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"},userData:{userId:"1",rating:5}},{recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"},userData:{userId:"1",rating:5}},{recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"},userData:{userId:"1",rating:5}}]}} as any);
        setOwnRecipes([{userData:{userId:"1",rating:5},recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"}},{userData:{userId:"1",rating:5},recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"}},{userData:{userId:"1",rating:5},recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"}},{userData:{userId:"1",rating:5},recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"}},{userData:{userId:"1",rating:5},recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"}},{userData:{userId:"1",rating:5},recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"}},{userData:{userId:"1",rating:5},recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"}},{userData:{userId:"1",rating:5},recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"}},{userData:{userId:"1",rating:5},recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"}},{userData:{userId:"1",rating:5},recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"}},{userData:{userId:"1",rating:5},recipe:{id:"1",name:"Test",imageUrl:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",createdById:"1"}}] as any);
        //fetchSuggestions();
    }, [])

    return (
        <div className="homepage">
            <div className="homepage-header">
                <div className="homepage-header-title">Home</div>
                <div></div>
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