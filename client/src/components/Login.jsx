import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { loginAction } from '../slices/userSlice';
import DefaultButton from '../ui/DefaultButton';
import { StyledInput } from '../ui/FormikBasicInput';
import Title from '../ui/Title';
import { appName } from '../ui/uiSettings';

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
                        <span>Username:</span>
                        <StyledInput type='text' name='username' id='username' value={username} onChange={(event) => setUsername(event.target.value)} />
                    </div>
                    <div className='form-input-section'>
                        <span className='form-input-text'>Password:</span>
                        <StyledInput type='password' name='password' id='password' value={password} onChange={(event) => setPassword(event.target.value)} />
                    </div>
                    <div>
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
        height: 500px;
        border: 1px solid #ccc;
        width: 400px;    
    }
    & > .login-form > form {
        display: table;
        width: 300px;
        > *:last-child {
            text-align: right;
        }
    }
    & > .login-form > .form-title {
        margin-bottom: 8px;
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