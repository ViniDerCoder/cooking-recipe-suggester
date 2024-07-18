import { getRecipeData as getChefkochData } from "../../utils/recipeImporter/chefkoch.de.js";
import { getRecipeData as getReweData } from "../../utils/recipeImporter/rewe.de.js";
import { getRecipeData as getEssenUndTrinkenData } from "../../utils/recipeImporter/essen-und-trinken.de.js";
import { getRecipeData as getGaumenfreundinData } from "../../utils/recipeImporter/gaumenfreundin.de.js";
import { getRecipeData as getEinfachbackenData } from "../../utils/recipeImporter/einfachbacken.de.js";
import { getRecipeData as getEatData } from "../../utils/recipeImporter/eat.de.js";
import { getRecipeData as getLeckerData } from "../../utils/recipeImporter/lecker.de.js";
import { getRecipeData as getAlnaturaData } from "../../utils/recipeImporter/alnatura.de.js";

import onReady from "../../utils/listener/ready.js";

export const validRecipeUrls = [
    "chefkoch.de",
    "rewe.de",
    "essen-und-trinken.de",
    "gaumenfreundin.de",
    "einfachbacken.de",
    "eat.de",
    "lecker.de",
    "alnatura.de"
]

export async function getRecipeData(url: unknown) {
    if(typeof url !== "string") return 'Invalid input';
    
    const decodedUrl = decodeURIComponent(url);
    if(url.includes("chefkoch.de")) return await getChefkochData(decodedUrl);
    if(url.includes("rewe.de")) return await getReweData(decodedUrl);
    if(url.includes("essen-und-trinken.de")) return await getEssenUndTrinkenData(decodedUrl);
    if(url.includes("gaumenfreundin.de")) return await getGaumenfreundinData(decodedUrl);
    if(url.includes("einfachbacken.de")) return await getEinfachbackenData(decodedUrl);
    if(url.includes("eat.de")) return await getEatData(decodedUrl);
    if(url.includes("lecker.de")) return await getLeckerData(decodedUrl);
    if(url.includes("alnatura.de")) return await getAlnaturaData(decodedUrl);
}

onReady("import test", async () => {
    console.log("Chefkoch.de");
    console.log(await getRecipeData("https://www.chefkoch.de/rezepte/1735501282565789/Der-weltbeste-Schokoladen-Blechkuchen.html"));
    console.log("Essen-und-trinken.de");
    console.log(await getRecipeData("https://www.essen-und-trinken.de/rezepte/spaghetti-alla-chitarra-mit-tomaten-und-brokkoli-rezept-13544448.html"));
    console.log("Gaumenfreundin.de");
    console.log(await getRecipeData("https://www.gaumenfreundin.de/cordon-bleu-selber-machen/"));
    console.log("Rewe.de");
    console.log(await getRecipeData("https://www.rewe.de/rezepte/suesskartoffel-gnocchi-blattspinat-feta/"));
    console.log("Einfachbacken.de");
    console.log(await getRecipeData("https://www.einfachbacken.de/rezepte/pfannkuchen-das-schnelle-grundrezept"));
    console.log("Eat.de");
    console.log(await getRecipeData("https://eat.de/rezept/haferflocken-schnitzel/#rezept"));
    console.log("Lecker.de");
    console.log(await getRecipeData("https://www.lecker.de/radieschen-burger-129293.html"));
    console.log("Alnatura.de");
    console.log(await getRecipeData("https://www.alnatura.de/de-de/rezepte/suche/sticky-rice-mit-mango-105858/"));
})