import '../../ColorScheme.css';
import './SuggestionSettings.css';

import { useEffect, useRef, useState } from 'react';
import { SuggestionsSettings } from '../../../../Backend/src/utils/types/suggestion';
import { getSuggestionSettings } from './suggestionSettingsLogic';

export default function SuggestionSettings(p: { hidden: boolean, setHidden: (hidden: boolean) => void }) {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<SuggestionsSettings>();
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
                <div className="suggestion-settings-content" onClick={(e) => {e.stopPropagation()}}>
                    <div className='suggestion-settings-content-title'>Einstellungen</div>
                    <div className="suggestuin-settings-content-section">
                        <div className="suggestion-settings-content-section-title">Morgens</div>
                        <div className="suggestion-settings-content-section-settings">
                            {settings ? Object.entries(settings.meals.morning.settings).map(([key, val]) => {
                                return <Setting title={key} value={val}/>
                            }) : null}
                        </div>
                    </div>
                    <div className="suggestuin-settings-content-section">
                        <div className="suggestion-settings-content-section-title">Mittags</div>
                        <div className="suggestion-settings-content-section-settings">
                            {settings ? Object.entries(settings.meals.midday.settings).map(([key, val]) => {
                                return <Setting title={key} value={val}/>
                            }) : null}
                        </div>
                    </div>
                    <div className="suggestuin-settings-content-section">
                        <div className="suggestion-settings-content-section-title">Abends</div>
                        <div className="suggestion-settings-content-section-settings">
                            {settings ? Object.entries(settings.meals.evening.settings).map(([key, val]) => {
                                return <Setting title={key} value={val}/>
                            }) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Setting(props: { title: string, value: number | boolean | string[] | null }) {
    return (
        <div className="suggestion-settings-content-section-settings-entry">
        </div>
    )
}