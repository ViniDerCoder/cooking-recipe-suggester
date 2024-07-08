import { getAuthToken } from "../utils/auth";
import { Backend } from "../utils/backendConnection/routes";



export default function Homepage() {
    const token = getAuthToken()
    Backend.Suggestions.getSuggestionsSettings((token ? token : ''))
    return (
        <div className="homepage">
            <header className="homepage-header">
                <div className='homepage-title'><strong>Homepage</strong></div>
            </header>
        </div>
    );
}
