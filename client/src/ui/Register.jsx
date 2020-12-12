import { Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import DefaultButton from './DefaultButton';
import { StyledInput } from './FormikBasicInput';
import Title, { Subtitle } from './Title';
import { appName, fontSizeLg, fontSizeMd } from './uiSettings';
import Divider from './Divider';
import * as Yup from 'yup';
import { registerAction } from '../slices/userSlice';
import { useHistory } from 'react-router';
import FormInputGroup from './FormInputGroup';
import { ReactComponent as BackImage } from '../svgs/left-arrow.svg';
import ImageFrame from './ImageFrame';
import { hslToRgb } from '@material-ui/core';

const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('This field is required'),
    password: Yup.string()
        .min(3, (obj) => `Password must be at least ${obj.min} characters`)
        .required('This field is required'),
    confirmPassword: Yup.string()
            .required('This field is required')
            .test('passwords-match', 'Passwords must match', function (value) {
        return this.parent.password === value;
    }),
    email: Yup.string().email('Email format is not valid').required('This field is required')
}
);

function Register(props) {

    const { className } = props;
    const dispatch = useDispatch();
    const history = useHistory();

    async function handleSubmit(values, { setSubmitting }) {
        setSubmitting(true);
        try {
            let dispatchResult = await dispatch(registerAction(values));
            console.log(dispatchResult);
            history.push('/boards');
        } catch (err) {
        }
    }

    function goBack() {
        history.goBack();
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
                validationSchema={RegisterSchema}
                enableReinitialize={true}>
                {formik => (
                    <Form className='login-form'>
                        <div className='form-title-group'>
                            <ImageFrame onClick={goBack} size='30px' component={<BackImage cursor='pointer' />} />
                            <Title className='form-title' dark>{appName}</Title>
                        </div>
                        <Subtitle color='#515f6b'>Create your account...</Subtitle>
                        <Divider color='#dcdcdc' />
                        <FormInputGroup label='Username' error={formik.touched.username && formik.errors.username}>
                            <StyledInput
                                disabled={formik.isSubmitting}
                                inError={formik.touched.username && formik.errors.username}
                                type='text'
                                className='form-input-element'
                                {...formik.getFieldProps('username')}
                            />
                        </FormInputGroup>
                        <FormInputGroup label='Email' className='form-input-section' error={formik.touched.email && formik.errors.email}>
                            <StyledInput
                                disabled={formik.isSubmitting}
                                inError={formik.touched.email && formik.errors.email}
                                type='email'
                                className='form-input-element'
                                {...formik.getFieldProps('email')}
                            />
                        </FormInputGroup>
                        <FormInputGroup  label='Password' error={formik.touched.password && formik.errors.password}>
                            <StyledInput
                                disabled={formik.isSubmitting}
                                type='password'
                                inError={formik.touched.password && formik.errors.password}
                                className='form-input-element'
                                {...formik.getFieldProps('password')} />
                        </FormInputGroup>
                        <FormInputGroup label='Confirm password' error={formik.touched.confirmPassword && formik.errors.confirmPassword}>
                            <StyledInput
                                disabled={formik.isSubmitting}
                                type='password'
                                inError={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                className='form-input-element'
                                {...formik.getFieldProps('confirmPassword')}
                            />
                        </FormInputGroup>
                        <div className='form-action-control'>
                            <DefaultButton
                                disabled={formik.isSubmitting}
                                type='submit'>Register</DefaultButton>
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
    & .form-title-group {
        display: flex;

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
    }
    & .form-subtitle {
        color: #515f6b;
    }
    & .form-input-error {
        color: red;
        width: 10px;
        min-width: 10px;
        text-align: center;
        padding-left: 3px;
    }
    & .form-input-error, & .form-input-text {
        font-size: ${fontSizeLg};
    }
    & .form-input-element {
        height: 36px;
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