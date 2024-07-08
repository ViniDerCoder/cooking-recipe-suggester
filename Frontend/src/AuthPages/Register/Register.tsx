import '../../ColorScheme.css';
import './../Login/Login.css'
import './Register.css';

import FormInput from '../../Defaults/Inputs/FormInput/FormInput';
import HoverButton from '../../Defaults/Buttons/HoverButton/HoverButton';

export default function Register() {
return (
    <div className="register">
        <header className="register-header">
            <div className='register-title'><strong>Register</strong></div>
            <div className='input-group'>
                <FormInput
                    type='text'
                    placeholder='Email'
                />
                <HoverButton
                    text='Send Verification Code'
                    onClick={() => { console.log('Send email verification') }}
                />
                <FormInput
                    type='text'
                    placeholder='Verification Code'
                />
                <FormInput
                    type='text'
                    placeholder='Username'
                />
                <FormInput
                    type='text'
                    placeholder='First Name'
                />
                <FormInput
                    type='text'
                    placeholder='Last Name'
                />
                <HoverButton
                    text='Register'
                    onClick={() => { console.log('Register') }}
                />
            </div>
            <div className='login-text'>Already have an account? <a className='login-link' href='./login'>Login</a></div>
        </header>
    </div>
);
}