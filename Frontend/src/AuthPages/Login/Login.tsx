import '../../ColorScheme.css';
import './Login.css';


export default function Login() {
return (
    <div className="login">
        <header className="login-header">
            <div className='login-title'><strong>Login</strong></div>
            <div className='input-group'>
                <input className='input' type='text' placeholder='Email' data-valid='false'></input>
                <button className='input-button'>Send Verification Code</button>
            </div>
        </header>
    </div>
);
}