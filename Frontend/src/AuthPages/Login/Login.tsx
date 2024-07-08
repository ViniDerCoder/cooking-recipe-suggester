import '../../ColorScheme.css';
import './Login.css';

import HoverButton from '../../Defaults/Buttons/HoverButton/HoverButton';
import FormInput from '../../Defaults/Inputs/FormInput/FormInput';
import { isEmail } from '../../utils/emails';


export default function Login() {
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
                    onClick={() => { 
                        if(document.querySelector('#email-login-input')?.getAttribute('data-valid') === 'true') console.log('Send email verification')
                        else console.log('Invalid email')
                    }}
                />
            </div>
            <div className='register-text'>Don't have an account? <a className='register-link' href='./register'>Register</a></div>
        </header>
    </div>
);
}