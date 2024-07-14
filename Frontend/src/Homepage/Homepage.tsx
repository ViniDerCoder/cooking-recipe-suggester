import RecipeEditor from "./RecipePage/RecipeEditor/RecipeEditor";
import RecipePage from "./RecipePage/RecipePage";



export default function Homepage() {
    return (
        <div className="homepage">
            <header className="homepage-header">
                <RecipeEditor/>
            </header>
        </div>
    );
}