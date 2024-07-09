import { getAuthToken } from "../utils/auth";
import { Backend } from "../utils/backendConnection/routes";
import RecipePage from "./RecipePage/RecipePage";



export default function Homepage() {
    console.log(getAuthToken())
    return (
        <div className="homepage">
            <header className="homepage-header">
                <div className='homepage-title'><strong>Homepage</strong></div>
                <RecipePage recipeId="2302335d-2561-4334-9136-6e383ef53fca"/>
            </header>
        </div>
    );
}