import { getAuthToken } from "../utils/auth";
import RecipeEditor from "./RecipePage/RecipeEditor/RecipeEditor";
import RecipePage from "./RecipePage/RecipePage";



export default function Homepage() {
    return (
        <div className="homepage">
            <header className="homepage-header">
                <RecipePage recipeId="2302335d-2561-4334-9136-6e383ef53fca"/>
            </header>
        </div>
    );
}