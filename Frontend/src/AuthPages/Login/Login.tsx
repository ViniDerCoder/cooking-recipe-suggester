import '../../ColorScheme.css';
import './Login.css';

import HoverButton from '../../Defaults/Buttons/HoverButton/HoverButton';
import FormInput from '../../Defaults/Inputs/FormInput/FormInput';
import { isEmail } from '../../utils/emails';
import { login, sendLoginValidationEmail } from './loginLogic';
import { useRef, useState } from 'react';

import { IoMdArrowRoundBack } from "react-icons/io";
import { basename } from '../../App';


export default function Login() {
    const [step, setStep] = useState(0)
    const [email, setEmail] = useState('')

    return (
        <div className="login">
            <header className="login-header">
                <div className='login-title'><strong>Login</strong></div>
                {step === 0 ? (<EnterEmail goForward={() => setStep(1)} emailState={[email, setEmail]} />) : (<EnterVerificationCode goBack={() => setStep(0)} email={email} />)}
                <div className='register-text'>Don't have an account? <a className='register-link' href='./register'>Register</a></div>
            </header>
        </div>
    );
}

function EnterEmail(p: {goForward: () => void, emailState: [string, (email: string) => void]}){
    const informationRef = useRef<HTMLDivElement>(null)
    return (
        <div className='input-group'>
            <FormInput
                type='text'
                placeholder='Email'
                onInput={(input, setValid) => {
                    p.emailState[1](input)
                    if (isEmail(input)) setValid(true)
                    else setValid(false)
                    if (input === '') setValid(undefined)
                }}
                sx={{
                    id: 'email-login-input',
                    value: p.emailState[0],
                }}
            />
            <div ref={informationRef} className='login-input-temporary-information' data-style="normal">Enter Email</div>
            <HoverButton
                text='Send Verification Code'
                onClick={async () => {
                    const element = document.querySelector('#email-login-input') as HTMLInputElement
                    if (isEmail(element.value)) {
                        const success = await sendLoginValidationEmail(element?.value)
                        const info = informationRef.current
                        if (info) {
                            info.innerHTML = success[0] ? 'Email sent' : success[1]
                            info.setAttribute('data-style', success[0] ? 'success' : 'danger')
                        }
                        if(success[0]) setTimeout(() => p.goForward(), 1000)
                    }
                    else {
                        const info = informationRef.current
                        if (info) {
                            info.innerHTML = 'Invalid email'
                            info.setAttribute('data-style', 'danger')
                        }
                    }
                }}
                sx={{
                    style: {
                        marginTop: '0'
                    }
                }}
            />
        </div>
    )
}

function EnterVerificationCode(p: {goBack: () => void, email: string}) {
    const informationRef = useRef<HTMLDivElement>(null)
    return (
        <div className='input-group'>
            <div className='verification-login-back-button' onClick={p.goBack}><IoMdArrowRoundBack/></div>
            <FormInput
                type='text'
                placeholder='Verification Code'
                onInput={async (input, setValid) => {
                    if (input.length === 6) setValid(true)
                    else setValid(false)
                    if (input === '') {
                        const info = informationRef.current
                        if (info) info.innerHTML = ''
                        setValid(undefined)
                    }
                }}
                sx={{
                    id: 'verification-code-login-input',
                    style: {
                        marginTop: '0'
                    }
                }}
            />
            <div ref={informationRef} className='login-input-temporary-information' data-style="normal"></div>
            <HoverButton
                text='Login'
                onClick={async () => {
                    const element = document.querySelector('#verification-code-login-input') as HTMLInputElement
                    if (element?.getAttribute('data-valid') === 'true') {
                        const info = informationRef.current
                        const success = await login(p.email, element?.value)
                        if (info) {
                            info.innerHTML = success[0] ? 'Logged in' : success[1]
                            info.setAttribute('data-style', success[0] ? 'success' : 'danger')
                            if(success[0]) setTimeout(() => window.location.href = basename + '/', 1000)
                        }
                    }
                    else {
                        const info = informationRef.current
                        if (info) {
                            info.innerHTML = 'Verification code is not 6 characters long'
                            info.setAttribute('data-style', 'danger')
                        }
                    }
                }}
                sx={{
                    style: {
                        marginTop: '0',
                        marginBottom: '1rem'
                    }
                }}
            />
        </div>
    )
}