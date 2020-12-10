import { Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import DefaultButton from './DefaultButton';
import { StyledInput } from './FormikBasicInput';
import Title from './Title';
import { appName, fontSizeMd } from './uiSettings';
import Divider from './Divider';
import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('Required field'),
    password: Yup.string().required('Required field'),
    confirmPassword: Yup.string().required('Required field'),
    email: Yup.string().required('Required field')
}
);

function Register(props) {

    const { className } = props;
    const dispatch = useDispatch();

    function handleSubmit(values, { setSubmitting }) {
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
                onSubmit={handleSubmit}
                validationSchema={RegisterSchema}>
                {formik => (
                    <Form className='login-form'>
                        <Title className='form-title' dark>{appName}</Title>
                        <span className='form-subtitle'>Create your account...</span>
                        <Divider color='#dcdcdc' />
                        <div className='form-input-section'>
                            <span className='form-input-text'>Username:</span>
                            <StyledInput
                                inError={formik.errors.username}
                                type='text'
                                className='form-input-element'
                                {...formik.getFieldProps('username')}
                            />
                            {formik.errors.username}
                        </div>
                        <div className='form-input-section'>
                            <span className='form-input-text'>Email:</span>
                            <StyledInput
                                inError={formik.errors.email}
                                type='email'
                                className='form-input-element'
                                {...formik.getFieldProps('email')}
                            />
                            {formik.errors.email}
                        </div>
                        <div className='form-input-section'>
                            <span className='form-input-text'>Password:</span>
                            <StyledInput
                                inError={formik.errors.password}
                                className='form-input-element'
                                {...formik.getFieldProps('password')} />
                            {formik.errors.password}
                        </div>
                        <div className='form-input-section'>
                            <span className='form-input-text'>Confim password:</span>
                            <StyledInput
                                inError={formik.errors.confirmPassword}
                                className='form-input-element'
                                {...formik.getFieldProps('confirmPassword')}
                            />
                            {formik.errors.confirmPassword}
                        </div>
                        <div className='form-action-control'>
                            <span></span>
                            <DefaultButton type='submit'>Register</DefaultButton>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default styled(Register)`
    & > .login-form {
        border: 1px solid #dcdcdc;
        width: 400px;    
        padding: 16px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

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
    & .form-title {
        margin-bottom: 8px;
        font-weight: bold;
    }
    & .form-subtitle {
        color: #515f6b;
    }
    & .form-input-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 5px 0;
        > .form-input-text {
            width: 350px;
            color: #515f6b;
        }
        > .form-input-element {
            height: 40px;
        }
        > *:last-child {
            display: initial;
        }
    }
    & .form-action-control {
        margin-top: 16px;
        text-align: right;
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