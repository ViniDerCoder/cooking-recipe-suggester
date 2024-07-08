import '../../ColorScheme.css';
import './../Login/Login.css'
import './Register.css';

import FormInput from '../../Defaults/Inputs/FormInput/FormInput';
import HoverButton from '../../Defaults/Buttons/HoverButton/HoverButton';
import { useRef, useState } from 'react';
import { isEmail } from '../../utils/emails';
import { register, sendRegisterValidationEmail } from './registerLogic';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { basename } from '../../App';

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
                    2: <EnterUserInformation goBack={() => setStep(1)} verificationCode={verificationCode} email={email} userDataState={[userData, setUserData]}/>
                }[step]
                }
                <div className='login-text'>Schon einen Account? <a className='login-link' href='./login'>Anmelden</a></div>
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
                text='Code senden'
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
    const informationRef = useRef<HTMLDivElement>(null)
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
            <div ref={informationRef} className='register-input-temporary-information' data-style="normal"></div>
            <HoverButton
                text='Next'
                onClick={() => { 
                    if(p.verificationCodeState[0].length === 6) p.goForward()
                    else {
                        const info = informationRef.current
                        if (info) {
                            info.innerHTML = 'Ungültiger Code'
                            info.setAttribute('data-style', 'danger')
                        }
                    }
                }}
            />
        </div>
    )
}

function EnterUserInformation(p: { goBack: () => void, email: string, verificationCode: string, userDataState: [{firstName: string, lastName: string, username: string}, (userData: {firstName: string, lastName: string, username: string}) => void]}) {
    const informationRef = useRef<HTMLDivElement>(null)
    return (
        <div className='input-group'>
            <div className='verification-register-back-button' onClick={p.goBack}><IoMdArrowRoundBack/></div>
            <FormInput
                type='text'
                placeholder='Nutzername'
                onInput={(input: string, setValid) => {
                    p.userDataState[1]({...p.userDataState[0], username: input})
                }}
                sx={{
                    style: {
                        marginTop: '0'
                    },
                    id: 'email-register-input-username',
                    value: p.userDataState[0].username
                }}
            />
            <FormInput
                type='text'
                placeholder='Vorname'
                onInput={(input: string, setValid) => {
                    p.userDataState[1]({...p.userDataState[0], firstName: input})
                }}
                sx={{
                    id: 'email-register-input-firstname',
                    value: p.userDataState[0].firstName
                }}
            />
            <FormInput
                type='text'
                placeholder='Nachname'
                onInput={(input: string, setValid) => {
                    p.userDataState[1]({...p.userDataState[0], lastName: input})
                }}
                sx={{
                    id: 'email-register-input-lastname',
                    value: p.userDataState[0].lastName
                }}
            />
            <HoverButton
                text='Registreren'
                onClick={async () => { 
                    const result = await register(
                        p.email, 
                        p.verificationCode,
                        p.userDataState[0].username, 
                        p.userDataState[0].firstName, 
                        p.userDataState[0].lastName
                    )   
                    const info = informationRef.current
                    if(result[0]) {
                        if (info) {
                            info.innerHTML = 'Erfolgreich registriert'
                            info.setAttribute('data-style', 'success')
                        }
                        setTimeout(() => window.location.href = basename + '/', 1000)
                    }
                    else {
                        if (info) {
                            info.innerHTML = result[1]
                            info.setAttribute('data-style', 'danger')
                        }
                    }
                }}
            />
            <div ref={informationRef} className='register-input-temporary-information' data-style="normal"></div>
        </div>
    )
}