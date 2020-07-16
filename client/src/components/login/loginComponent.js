import React, { useState } from 'react';
import FormInput from '../formInput/formInputComponent';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/authentication', {
            username, password
        }).then((data) => console.log(data)).catch((error) => console.log(error));
    }

    return (
        <form className="registration-form" onSubmit={e => handleSubmit(e)}>
            <h1>Login</h1>
            <FormInput for='Username' type='text' value={username} onChange={e => setUsername(e.target.value)} />
            <FormInput for='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
            <button>Submit</button>
        </form>
    );
}

export default Login;