import '../ColorScheme.css';
import './Homepage.css';
import RecipePreview from './RecipePreview/RecipePreview';



export default function Homepage() {
    return (
        <div className="homepage">
            <div className="homepage-header">
                <div className="homepage-header-title">Home</div>
                <div></div>
            </div>
            <div className="homepage-content">
                <div className="homepage-content-recipes">
                    <div className="homepage-content-recipes-suggestions">
                        <div className="homepage-content-recipes-suggestions-header">Vorschläge</div>
                        <div className="homepage-content-recipes-suggestions-list">
                            <RecipePreview showEditButton={false} rating={4.5} />
                        </div>
                    </div>
                    <div className="homepage-content-recipes-own">
                        <div className="homepage-content-recipes-own-header">Eigene Rezepte</div>
                        <div className="homepage-content-recipes-own-list"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}