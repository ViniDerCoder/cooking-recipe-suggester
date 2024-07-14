import '../../ColorScheme.css';
import './RecipePreview.css';




export default function RecipePreview(p: { imageUrl?: string, showEditButton: boolean, rating?: number }) {
    return (
        <div className="recipe-preview">
            <div className='recipe-preview-image-cover'>
                <img className="recipe-preview-image" alt="" src={p.imageUrl ? p.imageUrl : "https://fps.cdnpk.net/home/cover/image-12-sm.webp?w=438&h=438"} ></img>
            </div>
            <div className="recipe-preview-content">
                <div className="recipe-preview-name">Name</div>
                <div className="recipe-preview-rating">{p.rating ? p.rating : 'Keine Bewertung'}</div>
                {p.showEditButton ? <div className="recipe-preview-edit">Bearbeiten</div> : null}
            </div>
        </div>
    );
}