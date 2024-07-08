import '../../../ColorScheme.css'
import './FormInput.css'

import React from 'react';

export default function FormInput(props: { type: string, placeholder: string, valid?: boolean | undefined, onInput?: ((input: string, setValid: (state: boolean | undefined) => void) => void), sx?: React.InputHTMLAttributes<HTMLInputElement> }) {
    const { type, placeholder, valid, onInput, sx } = props
    const [validInput, setValidInput] = React.useState<boolean | undefined>(valid)
    return (
        <input className='form-input' type={type} placeholder={placeholder} data-valid={validInput} onInput={(e) => onInput ? onInput(e.currentTarget.value, (state: boolean | undefined) => setValidInput(state)) : undefined} {...sx}></input>
    );
}