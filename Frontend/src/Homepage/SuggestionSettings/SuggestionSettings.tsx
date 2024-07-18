import '../../ColorScheme.css';
import './SuggestionSettings.css';

import { useEffect, useRef, useState } from 'react';
import { SuggestionsSettings } from '../../../../Backend/src/utils/types/suggestion';
import { getSuggestionSettings, updateSuggestionSettings } from './suggestionSettingsLogic';

import { ImBlocked } from "react-icons/im";
import { getRecipeTypes } from '../RecipePage/RecipeEditor/recipeEditorLogic';
import { IoClose } from 'react-icons/io5';

export default function SuggestionSettings(p: { hidden: boolean, setHidden: (hidden: boolean) => void }) {
    const [loading, setLoading] = useState(true);
    const [recipeTypes, setRecipeTypes] = useState<{ id: string, name: string }[]>([]);
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
    const saveButton = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (p.hidden) return;

        const fetchSettings = async () => {
            const [lSettings, lRecipeTypes] = await Promise.all([
                getSuggestionSettings(),
                getRecipeTypes()
            ]);

            if (lSettings[0] && typeof lSettings[1] !== "string") setSettings(lSettings[1]);

            if (lRecipeTypes[0] && typeof lRecipeTypes[1] !== "string") setRecipeTypes(lRecipeTypes[1]);

            if (!lSettings[0] || !lRecipeTypes[0]) return setLoading(true);
            else setLoading(false);
        }
        fetchSettings();
    }, [p.hidden])

    return (
        <div className="suggestion-settings-root" data-hidden={p.hidden}>
            <div className="suggestion-settings" data-hidden={p.hidden}
                onClick={() => p.setHidden(true)}
            >
                <div className="suggestion-settings-content" onClick={(e) => { e.stopPropagation() }}>
                    <div className="suggestion-settings-close" onClick={(e) => { p.setHidden(true) }}>
                        <IoClose size={"2rem"} />
                    </div>
                    <div className='suggestion-settings-content-fadeout' id="top"></div>
                    <div className='suggestion-settings-content-settings'>
                        <div className='suggestion-settings-content-title'>Einstellungen</div>
                        {settings ? <SettingsSection recipeTypes={recipeTypes} setSettings={(val) => setSettings({ ...settings, meals: { ...settings.meals, morning: { ...settings.meals.morning, settings: val } } })} title="Morgens" settings={settings.meals.morning.settings} /> : null}
                        {settings ? <SettingsSection recipeTypes={recipeTypes} setSettings={(val) => setSettings({ ...settings, meals: { ...settings.meals, midday: { ...settings.meals.midday, settings: val } } })} title="Mittags" settings={settings.meals.midday.settings} /> : null}
                        {settings ? <SettingsSection recipeTypes={recipeTypes} setSettings={(val) => setSettings({ ...settings, meals: { ...settings.meals, evening: { ...settings.meals.evening, settings: val } } })} title="Abends" settings={settings.meals.evening.settings} /> : null}
                    </div>
                    <div className='suggestion-settings-content-fadeout' id="bottom"></div>
                </div>
                <div ref={saveButton} className="suggestion-settings-save"
                    onClick={async (e) => {
                        e.stopPropagation();
                        if (!saveButton.current) return
                        if (saveButton.current.dataset.saving === "true") return;
                        saveButton.current.dataset.saving = "true";
                        const result = await updateSuggestionSettings(settings);
                        if (result[0] && typeof result[1] !== "string") setSettings(result[1]);
                        saveButton.current.dataset.saving = "false";
                    }}
                >Speichern</div>
            </div>
        </div>
    )
}

function SettingsSection(props: { recipeTypes: { id: string, name: string }[], title: string, setSettings: (settings: SuggestionsSettings["meals"]["morning"]["settings"]) => void, settings: SuggestionsSettings["meals"]["morning"]["settings"] }) {
    return (
        <div className="suggestion-settings-content-section">
            <div className="suggestion-settings-content-section-title">{props.title}</div>
            <div className="suggestion-settings-content-section-settings">
                <Setting setValue={(value) => props.setSettings({ ...props.settings, minRating: value })} key={"minRating"} title={"Minimale Bewertung (0-10)"} value={props.settings.minRating} type='number' allowUndefined={false} />
                <Setting setValue={(value) => props.setSettings({ ...props.settings, unratedAllowed: value })} key={"unratedAllowed"} title={"Unbewertete einbeziehen"} value={props.settings.unratedAllowed} type='boolean' allowUndefined={false} />

                <Setting setValue={(value) => props.setSettings({ ...props.settings, minTimesCooked: value })} key={"minTimesCooked"} title={"Minimale Gekocht Anzahl"} value={props.settings.minTimesCooked} type='number' allowUndefined={false} />
                <Setting setValue={(value) => props.setSettings({ ...props.settings, timeoutAfterLastCooked: value })} key={"timeoutAfterLastCooked"} title={"Minimale Zeit seit letztem Kochen (in Stunden)"} value={props.settings.timeoutAfterLastCooked} type='number' allowUndefined={false} />

                <Setting setValue={(value) => props.setSettings({ ...props.settings, vegan: value })} key={"vegan"} title={"Vegan"} value={props.settings.vegan} type='boolean' allowUndefined={true} />
                <Setting setValue={(value) => props.setSettings({ ...props.settings, vegetarian: value })} key={"vegetarian"} title={"Vegetarisch"} value={props.settings.vegetarian} type='boolean' allowUndefined={true} />
                <Setting setValue={(value) => props.setSettings({ ...props.settings, glutenFree: value })} key={"glutenFree"} title={"Glutenfrei"} value={props.settings.glutenFree} type='boolean' allowUndefined={true} />
                <Setting setValue={(value) => props.setSettings({ ...props.settings, dairyFree: value })} key={"dairyFree"} title={"Ohne Milchprodukte"} value={props.settings.dairyFree} type='boolean' allowUndefined={true} />
                <Setting setValue={(value) => props.setSettings({ ...props.settings, nutFree: value })} key={"nutFree"} title={"Ohne Nüsse"} value={props.settings.nutFree} type='boolean' allowUndefined={true} />
                <Setting setValue={(value) => props.setSettings({ ...props.settings, eggFree: value })} key={"eggFree"} title={"Ohne Eiprodukte"} value={props.settings.eggFree} type='boolean' allowUndefined={true} />
                <Setting setValue={(value) => props.setSettings({ ...props.settings, fishFree: value })} key={"fishFree"} title={"Ohne Fisch"} value={props.settings.fishFree} type='boolean' allowUndefined={true} />
                <Setting setValue={(value) => props.setSettings({ ...props.settings, shellfishFree: value })} key={"shellfishFree"} title={"Ohne Schalentiere"} value={props.settings.shellfishFree} type='boolean' allowUndefined={true} />
                <Setting setValue={(value) => props.setSettings({ ...props.settings, soyFree: value })} key={"soyFree"} title={"Sojafrei"} value={props.settings.soyFree} type='boolean' allowUndefined={true} />

                <Setting setValue={(value) => props.setSettings({ ...props.settings, maxPreparationTime: value })} key={"maxPreparationTime"} title={"Maximale Vorbereitungszeit (in Minuten)"} value={props.settings.maxPreparationTime} type="number" allowUndefined={true} />

                <Setting recipeTypes={props.recipeTypes} setValue={(value) => props.setSettings({ ...props.settings, recipeTypesWhitelist: value })} key={"recipeTypesWhitelist"} title={"Rezept Typ Whitelist (leer für alle)"} value={props.settings.recipeTypesWhitelist} type="string[]" allowUndefined={false} />
                <Setting recipeTypes={props.recipeTypes} setValue={(value) => props.setSettings({ ...props.settings, recipeTypesBlacklist: value })} key={"recipeTypesBlacklist"} title={"Rezept Typ Blacklist"} value={props.settings.recipeTypesBlacklist} type="string[]" allowUndefined={false} />
            </div>
        </div>
    )
}

function Setting(props: { recipeTypes?: { id: string, name: string }[], title: string, value: number | boolean | string[] | null, setValue: (val: any) => void, type: "number" | "boolean" | "string[]", allowUndefined: boolean }) {
    const dropDownContentRef = useRef<HTMLDivElement>(null);
    const dropDownPreviewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropDownContentRef.current && dropDownPreviewRef.current &&
                !dropDownContentRef.current.contains(event.target as Node) &&
                !dropDownPreviewRef.current.contains(event.target as Node)) {
                dropDownContentRef.current.dataset.show = "false";
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="suggestion-settings-content-section-settings-entry-list" style={{ opacity: (props.value === null ? 0.5 : 1) }}>
            <div className="suggestion-settings-content-section-settings-entry" id={(props.type === "string[]" ? "strings" : props.type)}>
                <div className="suggestion-settings-content-section-settings-entry-title">{props.title}</div>
                {props.type === "boolean" ? <input type="checkbox" checked={props.value === null ? false : props.value as boolean} onChange={() => {
                    props.setValue((props.value as boolean) ? false : true)
                }} /> : null}
                {props.type === "number" ? <input type="number" value={props.value === null ? "" : props.value as number}
                    onChange={(e) =>
                        props.setValue(e.target.value === "" ? 0 : parseInt(e.target.value))
                    }
                /> : null}
                {props.type === "string[]" && props.recipeTypes ? <div id="dropdown">
                    <div ref={dropDownPreviewRef} id="dropdown-preview"
                        onClick={(e) => {
                            e.stopPropagation()
                            const cur = dropDownContentRef.current
                            if (cur) cur.dataset.show = cur.dataset.show === "true" ? "false" : "true"
                        }}
                    >
                        {(props.value as Array<string>).map((id) => props.recipeTypes?.find((val) => val.id === id)?.name).join(", ")}
                    </div>
                    <div ref={dropDownContentRef} id="dropdown-content" data-show={props.title === "Rezept Typ Blacklist" ? false : true}>
                        {props.recipeTypes.map(({ id, name }, i) => <div key={id} data-selected={(props.value as string[]).includes(id)} onClick={() => {
                            props.setValue((props.value as string[]).includes(id) ? (props.value as string[]).filter((val) => val !== id) : [...(props.value as string[]), id])
                        }}>{name}</div>)}
                    </div>
                </div> : null}
            </div>
            {props.allowUndefined ? <div style={{ opacity: (props.value === null ? 0.3 : 1), cursor: (props.value === null ? "default" : "pointer") }} className="suggestion-settings-content-section-settings-entry-undefined" onClick={() => props.setValue(null)}><ImBlocked /></div> : <div className="suggestion-settings-content-section-settings-entry-undefined"></div>}
        </div>
    )
}