import '../../ColorScheme.css';
import './SuggestionSettings.css';

import { useEffect, useRef, useState } from 'react';
import { SuggestionsSettings } from '../../../../Backend/src/utils/types/suggestion';
import { getSuggestionSettings } from './suggestionSettingsLogic';

export default function SuggestionSettings(p: {hidden: boolean}) {
    const [hidden, setHidden] = useState(p.hidden);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<SuggestionsSettings>();
    const isFirstRender = useRef(true);

    useEffect(() => {
        if(isFirstRender.current) {
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
        <div className="suggestion-settings" data-hidden={hidden}>

        </div>
    )
}