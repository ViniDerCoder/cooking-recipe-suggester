import '../../ColorScheme.css'
import './Tooltip.css'

import { useState } from "react"

export default function Tooltip(p: { element: JSX.Element, message: string | JSX.Element, sx?: React.HTMLAttributes<HTMLDivElement> }) {
    const [visibleTooltip, setVisibleTooltip] = useState(false)
    return (
        <div>
            <div
                onTouchStart={() => setVisibleTooltip(true)}
                onTouchEnd={() => setVisibleTooltip(false)}
                onMouseEnter={() => setVisibleTooltip(true)}
                onMouseLeave={() => setVisibleTooltip(false)}
                onTouchCancel={() => setVisibleTooltip(false)}
            >{p.element}</div>
            {visibleTooltip ? <div className='tooltip' {...p.sx}>{p.message}</div> : null}
        </div>
    )
}