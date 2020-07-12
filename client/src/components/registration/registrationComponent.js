import React, { useState } from 'react';
import FormInput from '../formInput/formInputComponent';

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <form className="registration-form" onSubmit={e => handleSubmit(e)}>
            <h1>Registration</h1>
            <FormInput for='Username' type='text' value={username} onChange={e => setUsername(e.target.value)} />
            <FormInput for='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
            <button>Submit</button>
        </form>
        );

} 

export default Registration;