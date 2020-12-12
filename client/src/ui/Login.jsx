import { Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { loginAction } from '../slices/userSlice';
import DefaultButton from '../ui/DefaultButton';
import { StyledInput } from '../ui/FormikBasicInput';
import * as Yup from 'yup';
import Title, { Subtitle } from '../ui/Title';
import { appName, fontSizeLg } from '../ui/uiSettings';
import FormInputGroup from './FormInputGroup';
import LinkButton from './LinkButton';
import Divider from './Divider';

const LoginSchema = Yup.object().shape({
    username: Yup.string().required('This field is required').min(3),
    password: Yup.string().required('This field is required').min(3),
}
);


function Login(props) {

    const { className } = props;
    const dispatch = useDispatch();
    const history = useHistory();

    async function handleSubmit(values, { setSubmitting }) {
        setSubmitting(true);
        await dispatch(loginAction(values));
        history.push('/boards');
    }

    return (
        <div className={className}>
            <Formik
                initialValues={
                    {
                        username: '',
                        password: ''
                    }
                }
                onSubmit={handleSubmit}
                validationSchema={LoginSchema}
                enableReinitialize={true}>
                {(formik) => (
                    <Form>
                        <div className='login-form'>
                            <Title className='form-title' dark>{appName}</Title>
                            <Subtitle color='#515f6b'>Sign in to your account</Subtitle>
                            <Divider color='#dcdcdc' />
                            <FormInputGroup label='Username' error={formik.touched.username && formik.errors.username}>
                                <StyledInput
                                    inError={formik.touched.username && formik.errors.username}
                                    type='text'
                                    className='form-input-element'
                                    {...formik.getFieldProps('username')}
                                />
                            </FormInputGroup>
                            <FormInputGroup label='Password' error={formik.touched.password && formik.errors.password}>
                                <StyledInput
                                    type='password'
                                    inError={formik.touched.password && formik.errors.password}
                                    className='form-input-element'
                                    {...formik.getFieldProps('password')} />
                            </FormInputGroup>
                            <div className='form-buttons'>
                                <LinkButton to='/register'>Registration</LinkButton>
                                <DefaultButton type='submit'>Login</DefaultButton>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default styled(Login)`
    & .login-form {
        border: 1px solid #ccc;
        width: 400px;
        top: 45%; 
        right: 50%;
        transform: translate(50%,-50%);
        position: absolute;
        background-color: #f9f9f9;
        padding: 16px;
    }
    & .form-title {
        margin-bottom: 8px;
    }
    & .form-buttons {
        text-align: right;
        margin-top: 16px;
        > *:first-child {
            margin-right: 4px;
        }
        > *:last-child {
            margin-left: 4px;
        }
    }
    & .form-input-text {
        font-size: ${fontSizeLg};
    }
`;