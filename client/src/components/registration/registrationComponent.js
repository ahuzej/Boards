import React, { useState } from 'react';
import FormInput from '../formInput/formInputComponent';
import axios from 'axios';

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('http://localhost:3001/users', {
            username, password, firstName, lastName
        }).then((data) => console.log(data));
    }

    return (
        <form className="registration-form" onSubmit={e => handleSubmit(e)}>
            <h1>Registration</h1>
            <FormInput for='Name' type='text' value={firstName} onChange={e => setFirstName(e.target.value)} />
            <FormInput for='Surname' type='text' value={lastName} onChange={e => setLastName(e.target.value)} />
            <FormInput for='Username' type='text' value={username} onChange={e => setUsername(e.target.value)} />
            <FormInput for='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
            <FormInput for='Confirm password' type='password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

            <button>Submit</button>
        </form>
        );

} 

export default Registration;