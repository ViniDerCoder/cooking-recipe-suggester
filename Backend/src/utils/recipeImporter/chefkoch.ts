import axios from "axios"

export async function getRecipeData(url: string) {

    const response = await axios.get(url);
}