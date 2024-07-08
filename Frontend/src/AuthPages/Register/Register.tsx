import '../../ColorScheme.css';
import './../Login/Login.css'
import './Register.css';

import FormInput from '../../Defaults/Inputs/FormInput/FormInput';
import HoverButton from '../../Defaults/Buttons/HoverButton/HoverButton';
import { useRef, useState } from 'react';
import { isEmail } from '../../utils/emails';
import { register, sendRegisterValidationEmail } from './registerLogic';
import { IoMdArrowRoundBack } from 'react-icons/io';

export default function Register() {
    const [step, setStep] = useState(0)
    const [email, setEmail] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [userData, setUserData] = useState({firstName: '', lastName: '', username: ''})

    return (
        <div className="register">
            <header className="register-header">
                <div className='register-title'><strong>Register</strong></div>
                {{
                    0: <EnterEmail goForward={() => setStep(1)} emailState={[email, setEmail]}/>,
                    1: <EnterVerificationCode goBack={() => setStep(0)} goForward={() => setStep(2)} email={email} verificationCodeState={[verificationCode, setVerificationCode]}/>,
                    2: <EnterUserInformation goBack={() => setStep(1)} email={email}/>
                }[step]
                }
                <div className='login-text'>Already have an account? <a className='login-link' href='./login'>Login</a></div>
            </header>
        </div>
    );
}

function EnterEmail(p: { goForward: () => void, emailState: [string, (email: string) => void] }) {
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
                    id: 'email-register-input',
                    value: p.emailState[0],
                }}
            />
            <div ref={informationRef} className='register-input-temporary-information' data-style="normal">Email eingeben</div>
            <HoverButton
                text='Verifizierungscode senden'
                onClick={async () => {
                    const element = document.querySelector('#email-register-input') as HTMLInputElement
                    if (isEmail(element.value)) {
                        const success = await sendRegisterValidationEmail(element?.value)
                        const info = informationRef.current
                        if (info) {
                            info.innerHTML = success[0] ? 'Email gesendet' : success[1]
                            info.setAttribute('data-style', success[0] ? 'success' : 'danger')
                        }
                        if (success[0]) setTimeout(() => p.goForward(), 1000)
                    }
                    else {
                        const info = informationRef.current
                        if (info) {
                            info.innerHTML = 'Ungültige Email'
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

function EnterVerificationCode(p: { goBack: () => void, goForward: () => void, email: string, verificationCodeState: [string, (verificationCode: string) => void]}) {
    return (
        <div className='input-group'>
            <div className='verification-register-back-button' onClick={p.goBack}><IoMdArrowRoundBack/></div>
            <FormInput
                type='text'
                placeholder='Verifizierungscode'
                onInput={(input, setValid) => {
                    p.verificationCodeState[1](input)
                    if (input.length === 6) setValid(true)
                    else setValid(false)
                    if (input === '') setValid(undefined)
                }}
                sx={{
                    id: 'email-register-input',
                    value: p.verificationCodeState[0],
                    style: {marginTop: '0'}
                }}
            />
            <HoverButton
                text='Next'
                onClick={() => { console.log('Register') }}
            />
        </div>
    )
}

function EnterUserInformation(p: { goBack: () => void, email: string }) {
    return (
        <div className='input-group'>
            <div className='verification-register-back-button' onClick={p.goBack}><IoMdArrowRoundBack/></div>
            <FormInput
                type='text'
                placeholder='Nutzername'
                sx={{
                    style: {
                        marginTop: '0'
                    }
                }}
            />
            <FormInput
                type='text'
                placeholder='Vorname'
            />
            <FormInput
                type='text'
                placeholder='Nachname'
            />
            <HoverButton
                text='Register'
                onClick={() => { 
                    register(p.email, '123456', 'username', 'firstName', 'lastName')    
                }}
            />
        </div>
    )
}