import { Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import DefaultButton from './DefaultButton';
import { StyledInput } from './FormikBasicInput';
import Title from './Title';
import { appName, fontSizeMd } from './uiSettings';
import Divider from './Divider';

function Register(props) {

    const { className } = props;
    const dispatch = useDispatch();

    function handleSubmit(values, { setSubmitting }) {
        console.log(values);
        setSubmitting(true);
        //dispatch(registerAction(values));
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
                {formik => (
                    <Form onClick={console.log(formik)} className='login-form'>
                        <Title className='form-title' dark>{appName}</Title>
                        <Divider />
                        <form>
                            <span>Create your account...</span>
                            <div className='form-input-section'>
                                <span>Username:</span>
                                <StyledInput
                                    onChange={formik.handleChange}
                                    disabled={formik.isSubmitting}
                                    type='text'
                                    name='username'
                                    id='username' />
                            </div>
                            <div className='form-input-section'>
                                <span className='form-input-text'>Email:</span>
                                <StyledInput
                                    onChange={formik.handleChange}
                                    disabled={formik.isSubmitting}
                                    type='email'
                                    name='email'
                                    id='email' />
                            </div>
                            <div className='form-input-section'>
                                <span className='form-input-text'>Password:</span>
                                <StyledInput
                                    onChange={formik.handleChange}
                                    disabled={formik.isSubmitting}
                                    type='password'
                                    name='password'
                                    id='password' />
                            </div>
                            <div className='form-input-section'>
                                <span className='form-input-text'>Confim password:</span>
                                <StyledInput
                                    onChange={formik.handleChange}
                                    disabled={formik.isSubmitting}
                                    type='password'
                                    name='confirmPassword'
                                    id='confirmPassword' />
                            </div>
                            <div>
                                
                                <span></span>
                                <DefaultButton type='submit'>Register</DefaultButton>
                            </div>
                        </form>
                    </Form>
                )}


            </Formik>
        </div>
    );
}

export default styled(Register)`
    & > .login-form {
        height: 500px;
        border: 1px solid #ccc;
        width: 400px;    
        margin: 0 auto;
        padding: 16px;
    }
    & > .login-form > form {
        display: table;
        width: 100%;
        * {
            font-size: ${fontSizeMd};
        }
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