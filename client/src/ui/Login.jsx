import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { loginAction } from '../slices/userSlice';
import DefaultButton from '../ui/DefaultButton';
import { StyledInput } from '../ui/FormikBasicInput';
import Title from '../ui/Title';
import { appName, fontSizeLg } from '../ui/uiSettings';

function Login(props) {

    const { className } = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();

    async function handleSubmit(event) {
        event.preventDefault();
        dispatch(loginAction({ username, password }));
        history.push('/projects');
    }

    return (
        <div className={className}>
            <div className='login-form'>
                <Title className='form-title' dark>{appName}</Title>
                <form onSubmit={handleSubmit}>
                    <div className='form-input-section'>
                        <span className='form-input-text'>Username:</span>
                        <StyledInput type='text' name='username' id='username' value={username} onChange={(event) => setUsername(event.target.value)} />
                    </div>
                    <div className='form-input-section'>
                        <span className='form-input-text'>Password:</span>
                        <StyledInput type='password' name='password' id='password' value={password} onChange={(event) => setPassword(event.target.value)} />
                    </div>
                    <div className='form-buttons'>
                        <span></span>
                        <DefaultButton type='submit'>Login</DefaultButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default styled(Login)`
    & > .login-form {
        border: 1px solid #ccc;
        width: 400px;    
        top: 45%; 
        right: 50%;
        transform: translate(50%,-50%);
        position: absolute;
        background-color: #f9f9f9;
        padding: 16px;
    }
    & > .login-form > form {
        display: table;
        width: 100%;
        > *:last-child {
            text-align: right;
        }
    }
    & > .login-form > .form-title {
        margin-bottom: 8px;
        color: ${props => props.theme.lightBg};
    }
    & .form-input-text {
        font-size: ${fontSizeLg};
    }
    & .form-input-section {
        height: 50px;

        > *:last-child {
            display: initial;
        }
    }
    & > .login-form > form > * {
        display: table-row;

        > *:first-child {
            margin-right: 8px;
        }
    }
    & .form-buttons {
        > *:last-child {
            margin-left: 8px;
        }
    }
    & > .login-form > form > * > * {
        display: table-cell;

        > *:first-child {
            margin-right: 8px;
        }

        > *:last-child {
            margin-left: 8px;
        }
    }
`;