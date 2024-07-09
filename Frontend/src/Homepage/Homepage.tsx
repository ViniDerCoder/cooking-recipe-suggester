import { getAuthToken } from "../utils/auth";
import { Backend } from "../utils/backendConnection/routes";
import RecipePage from "./RecipePage/RecipePage";



export default function Homepage() {
    console.log(getAuthToken())
    return (
        <div className="homepage">
            <header className="homepage-header">
                <div className='homepage-title'><strong>Homepage</strong></div>
                <RecipePage recipeId="1"/>
            </header>
        </div>
    );
}