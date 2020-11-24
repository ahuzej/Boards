import { Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import DefaultButton from '../ui/DefaultButton';
import { StyledInput } from '../ui/FormikBasicInput';
import Title from '../ui/Title';
import { appName } from '../ui/uiSettings';
import { registerAction } from '../actions/authActions';

function Register(props) {

    const { className } = props;
    const dispatch = useDispatch();

    async function handleSubmit(values) {
        dispatch(registerAction(values));
    }

    return (
        <div className={className}>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    confirmPassword: '',
                    email: ''
                }}
                onSubmit={handleSubmit}>
                <Form className='login-form'>
                    <Title className='form-title' dark>{appName}</Title>
                    <form onSubmit={handleSubmit}>
                        <div className='form-input-section'>
                            <span>Username:</span>
                            <StyledInput type='text' name='username' id='username' />
                        </div>
                        <div className='form-input-section'>
                            <span className='form-input-text'>Email:</span>
                            <StyledInput type='email' name='email' id='email' />
                        </div>
                        <div className='form-input-section'>
                            <span className='form-input-text'>Password:</span>
                            <StyledInput type='password' name='password' id='password'  />
                        </div>
                        <div className='form-input-section'>
                            <span className='form-input-text'>Confim password:</span>
                            <StyledInput type='password' name='confirmPassword' id='confirmPassword' />
                        </div>
                        <div>
                            <span></span>
                            <DefaultButton type='submit'>Register</DefaultButton>
                        </div>
                    </form>
                </Form>

            </Formik>
        </div>
    );
}

export default styled(Register)`
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