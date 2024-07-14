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
                            <RecipePreview name='Käsekuchen' imageUrl='https://www.einfachbacken.de/sites/einfachbacken.de/files/styles/full_width_tablet_4_3/public/2022-04/lotus_cheesecake_2.jpeg?h=4521fff0&itok=M7V3ZxHJ' showEditButton={true} rating={7} recipeId='2302335d-2561-4334-9136-6e383ef53fca' />
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