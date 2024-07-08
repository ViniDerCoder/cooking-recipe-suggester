import '../../ColorScheme.css';
import './Login.css';

import HoverButton from '../../Defaults/Buttons/HoverButton/HoverButton';
import FormInput from '../../Defaults/Inputs/FormInput/FormInput';
import { isEmail } from '../../utils/emails';
import { login, sendLoginValidationEmail } from './loginLogic';
import { useRef } from 'react';


export default function Login() {
    const informationRef1 = useRef<HTMLDivElement>(null)
    const informationRef2 = useRef<HTMLDivElement>(null)
    
return (
    <div className="login">
        <header className="login-header">
            <div className='login-title'><strong>Login</strong></div>
            <div className='input-group'>
                <FormInput
                    type='text'
                    placeholder='Email'
                    onInput={(input, setValid) => { 
                        console.log(input)
                        if(isEmail(input)) setValid(true)
                        else setValid(false)
                        if(input === '') setValid(undefined)
                    }}
                    sx={{
                        id: 'email-login-input'
                    }}
                />
                <HoverButton
                    text='Send Verification Code'
                    onClick={async () => { 
                        const element = document.querySelector('#email-login-input') as HTMLInputElement
                        if(element?.getAttribute('data-valid') === 'true') {
                            const success = await sendLoginValidationEmail(element?.value)
                            const info = informationRef1.current
                            if(info) {
                                info.innerHTML = success[0] ? 'Email sent' : success[1]
                                info.setAttribute('data-style', success[0] ? 'success' : 'danger')
                            }
                        }
                        else {
                            const info = informationRef1.current
                            if(info) {
                                info.innerHTML = 'Invalid email'
                                info.setAttribute('data-style','danger')
                            }
                        }
                    }}
                    sx={{
                        style: {
                            marginBottom: 0
                        }
                    }}
                />
                <div ref={informationRef1} className='login-input-temporary-information' data-style="normal">Enter Email</div>
                <FormInput
                    type='text'
                    placeholder='Verification Code'
                    onInput={async (input, setValid) => { 
                        console.log(input)
                        if(input.length === 6) setValid(true)
                        else setValid(false)
                        if(input === '') {
                            const info = informationRef2.current
                            if(info) info.innerHTML = ''
                            setValid(undefined)
                        }
                        if(input.length === 6) {
                            const info = informationRef2.current
                            const success = await login((document.querySelector('#email-login-input') as HTMLInputElement)?.value, input)
                            if(info) {
                                info.innerHTML = success[0] ? 'Logged in' : success[1]
                                info.setAttribute('data-style', success[0] ? 'success' : 'danger')
                            }
                        }
                    }}
                    sx={{
                        id: 'verification-code-login-input',
                        style: {
                            marginBottom: '1rem'
                        }
                    }}
                />
                <div ref={informationRef2} className='login-input-temporary-information' data-style="normal"></div>
            </div>
            <div className='register-text'>Don't have an account? <a className='register-link' href='./register'>Register</a></div>
        </header>
    </div>
);
}