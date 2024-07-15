import '../../ColorScheme.css';
import './SuggestionSettings.css';

import { useEffect, useRef, useState } from 'react';
import { SuggestionsSettings } from '../../../../Backend/src/utils/types/suggestion';
import { getSuggestionSettings } from './suggestionSettingsLogic';

import { ImBlocked } from "react-icons/im";

export default function SuggestionSettings(p: { hidden: boolean, setHidden: (hidden: boolean) => void }) {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<SuggestionsSettings>({
        userId: "1",
        meals: {
            morning: {
                enabled: true,
                settings: {
                    minRating: 0,
                    unratedAllowed: true,
                    minTimesCooked: 1,
                    timeoutAfterLastCooked: 1,
                    vegan: null,
                    vegetarian: null,
                    glutenFree: true,
                    dairyFree: null,
                    nutFree: null,
                    eggFree: false,
                    fishFree: null,
                    shellfishFree: null,
                    soyFree: true,
                    maxPreparationTime: null,
                    recipeTypesWhitelist: [],
                    recipeTypesBlacklist: []
                }
            },
            midday: {
                enabled: true,
                settings: {
                    minRating: 2,
                    unratedAllowed: false,
                    minTimesCooked: 1,
                    timeoutAfterLastCooked: 24,
                    vegan: true,
                    vegetarian: null,
                    glutenFree: null,
                    dairyFree: null,
                    nutFree: null,
                    eggFree: null,
                    fishFree: null,
                    shellfishFree: null,
                    soyFree: null,
                    maxPreparationTime: 60,
                    recipeTypesWhitelist: [],
                    recipeTypesBlacklist: []
                }
            },
            evening: {
                enabled: false,
                settings: {
                    minRating: 0,
                    unratedAllowed: true,
                    minTimesCooked: 2,
                    timeoutAfterLastCooked: 0,
                    vegan: false,
                    vegetarian: false,
                    glutenFree: null,
                    dairyFree: null,
                    nutFree: null,
                    eggFree: true,
                    fishFree: null,
                    shellfishFree: null,
                    soyFree: null,
                    maxPreparationTime: null,
                    recipeTypesWhitelist: [],
                    recipeTypesBlacklist: []
                }
            }
        }
    });
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const fetchSettings = async () => {
            const [lSettings] = await Promise.all([
                getSuggestionSettings()
            ]);

            if (lSettings[0] && typeof lSettings[1] !== "string") setSettings(lSettings[1]);

            if (!lSettings[0]) return setLoading(true);
        }
        console.log("fetching settings")
    }, [])

    return (
        <div className="suggestion-settings-root" data-hidden={p.hidden}>
            <div className="suggestion-settings" data-hidden={p.hidden}
                onClick={() => p.setHidden(true)}
            >
                <div className="suggestion-settings-content" onClick={(e) => { e.stopPropagation() }}>
                    <div className='suggestion-settings-content-title'>Einstellungen</div>
                    {settings ? <SettingsSection title="Morgens" settings={settings.meals.morning.settings} /> : null}
                    {settings ? <SettingsSection title="Mittags" settings={settings.meals.midday.settings} /> : null}
                    {settings ? <SettingsSection title="Abends" settings={settings.meals.evening.settings} /> : null}
                </div>
            </div>
        </div>
    )
}

function SettingsSection(props: { title: string, settings: SuggestionsSettings["meals"]["morning"]["settings"] }) {
    return (
        <div className="suggestion-settings-content-section">
            <div className="suggestion-settings-content-section-title">{props.title}</div>
            <div className="suggestion-settings-content-section-settings">
                <Setting key={"minRating"} title={"Minimale Bewertung"} value={props.settings.minRating} type='number' allowUndefined={false} />
                <Setting key={"unratedAllowed"} title={"Unbewertete einbeziehen"} value={props.settings.unratedAllowed} type='boolean' allowUndefined={false} />

                <Setting key={"minTimesCooked"} title={"Minimale Gekocht Anzahl"} value={props.settings.minTimesCooked} type='number' allowUndefined={false} />
                <Setting key={"timeoutAfterLastCooked"} title={"Minimale Zeit seit letztem Kochen (in Stunden)"} value={props.settings.timeoutAfterLastCooked} type='number' allowUndefined={false} />

                <Setting key={"vegan"} title={"Vegan"} value={props.settings.vegan} type='boolean' allowUndefined={true} />
                <Setting key={"vegetarian"} title={"Vegetarisch"} value={props.settings.vegetarian} type='boolean' allowUndefined={true} />
                <Setting key={"glutenFree"} title={"Glutenfrei"} value={props.settings.glutenFree} type='boolean' allowUndefined={true} />
                <Setting key={"dairyFree"} title={"Ohne Milchprodukte"} value={props.settings.dairyFree} type='boolean' allowUndefined={true} />
                <Setting key={"nutFree"} title={"Ohne Nüsse"} value={props.settings.nutFree} type='boolean' allowUndefined={true} />
                <Setting key={"eggFree"} title={"Ohne Eiprodukte"} value={props.settings.eggFree} type='boolean' allowUndefined={true} />
                <Setting key={"fishFree"} title={"Ohne Fisch"} value={props.settings.fishFree} type='boolean' allowUndefined={true} />
                <Setting key={"shellfishFree"} title={"Ohne Schalentiere"} value={props.settings.shellfishFree} type='boolean' allowUndefined={true} />
                <Setting key={"soyFree"} title={"Sojafrei"} value={props.settings.soyFree} type='boolean' allowUndefined={true} />

                <Setting key={"maxPreparationTime"} title={"Maximale Vorbereitungszeit (in Minuten)"} value={props.settings.maxPreparationTime} type="number" allowUndefined={true} />

                <Setting key={"recipeTypesWhitelist"} title={"Rezept Typ Whitelist (leer für alle)"} value={props.settings.recipeTypesWhitelist} type="string[]" allowUndefined={false} />
                <Setting key={"recipeTypesBlacklist"} title={"Rezept Typ Blacklist"} value={props.settings.recipeTypesBlacklist} type="string[]" allowUndefined={false} />
            </div>
        </div>
    )
}

function Setting(props: { title: string, value: number | boolean | string[] | null, type: "number" | "boolean" | "string[]", allowUndefined: boolean }) {
    return (
        <div className="suggestion-settings-content-section-settings-entry-list">
            <div className="suggestion-settings-content-section-settings-entry" id={(props.type === "string[]" ? "strings" : props.type)}>
                <div className="suggestion-settings-content-section-settings-entry-title">{props.title}</div>
                {props.type === "boolean" ? <input type="checkbox" checked={props.value as boolean} /> : null}
                {props.type === "number" ? <input type="number" value={props.value as number} /> : null}
                {props.type === "string[]" ? <input type="text" value={props.value as Array<string>} /> : null}

            </div>
            {props.allowUndefined ? <div className="suggestion-settings-content-section-settings-entry-undefined" onClick={() => {}}><ImBlocked /></div> : <div className="suggestion-settings-content-section-settings-entry-undefined"></div>}
        </div>
    )
}