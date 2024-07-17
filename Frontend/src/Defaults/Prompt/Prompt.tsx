import { forwardRef, useImperativeHandle, useState } from 'react';
import '../../ColorScheme.css';
import './Prompt.css';



const Prompt = forwardRef((p: { 
    message: string, 
    initialVal?: string, 
    onChange?: (newVal: string) => void, 
    onFinish: (val: string) => void,
    onCancel?: () => void 
}, ref) => {
    const [active, setActive] = useState(false);
    const [input, setInput] = useState(p.initialVal || '');

    useImperativeHandle(ref, () => ({
        setActive: (val: boolean) => setActive(val),
        toggleActive: () => setActive(!active)
    }));

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            if (p.onFinish) p.onFinish(input);
            setActive(false);
        }
    }

    return (
        <div className="prompt-wrapper" data-active={active} onClick={() => {
            if (p.onCancel) p.onCancel()
            setActive(false);
        }}>
            <div className="prompt" data-active={active}
                onClick={(e) => e.stopPropagation()}
            >
                <p>{p.message}</p>
                <div>
                <input 
                type="text" 
                value={p.initialVal} 
                onChange={(e) => { 
                    if(p.onChange) p.onChange(e.target.value)
                    setInput(e.target.value)
                }}
                onKeyDown={handleKeyDown}
                 />
                <button onClick={() => {
                    if (p.onFinish) p.onFinish(input)
                    setActive(false);
                }}>Fertig</button>
                </div>
            </div>
        </div>
    )
})

export default Prompt;