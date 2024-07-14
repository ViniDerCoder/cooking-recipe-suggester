import '../../ColorScheme.css';
import Tooltip from '../../Defaults/Tooltip/Tooltip';
import './RecipePreview.css';

import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { MdModeEdit } from "react-icons/md";




export default function RecipePreview(p: { imageUrl?: string, showEditButton: boolean, rating?: number, name: string, recipeId: string }) {
    return (
        <div className="recipe-preview"
            onClick={() => {
                window.location.href = `./#/recipe/${p.recipeId}`;
            }}
        >
            <div className='recipe-preview-image-cover'>
                <img className="recipe-preview-image" alt="" src={p.imageUrl ? p.imageUrl : "https://cdn3.iconfinder.com/data/icons/design-n-code/100/272127c4-8d19-4bd3-bd22-2b75ce94ccb4-512.png"} ></img>
            </div>
            <div className="recipe-preview-content">
                <div className="recipe-preview-rating">{[...Array(5)].map((e, i) => {
                    return <div className="recipe-preview-rating-star">
                        {p.rating ? p.rating >= i * 2 + 2 ? <FaStar color='gold' size={"1.2rem"} /> : p.rating >= i * 2 + 1 ? <FaStarHalfAlt color='gold' size={"1.2rem"} /> : <FaRegStar color='gold' size={"1.2rem"} /> : <FaRegStar color='gold' size={"1.2rem"} />}
                    </div>
                })}
                </div>
                <div className='recipe-preview-content-row'>
                    <Tooltip
                        element={<div className="recipe-preview-name" >{p.name}</div>}
                        message={p.name}
                    />
                    {p.showEditButton ? <div className="recipe-preview-edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `./#/recipe/${p.recipeId}/editor`;
                        }}
                    >
                        <MdModeEdit size={"1.2rem"} />
                    </div> : null}
                </div>
            </div>
        </div>
    );
}