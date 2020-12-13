import { Form, Formik } from 'formik';
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import SectionHeading from '../ui/SectionHeading';
import styled from 'styled-components';
import { StyledInput, StyledTextArea } from '../ui/FormikBasicInput';
import DefaultButton from '../ui/DefaultButton';
import { useHistory } from 'react-router';
import { createBoard } from '../slices/boardsSlice';
import { getUserSelector } from '../slices/userSlice';
import Title, { Subtitle } from '../ui/Title';
import FormInputGroup from '../ui/FormInputGroup';

const BoardSchema = Yup.object().shape({
    name: Yup.string().required('Required field'),
    description: Yup.string()
}
);

function BoardForm(props) {
    const { className } = props;
    const dispatch = useDispatch();
    const user = useSelector(getUserSelector);
    const history = useHistory();

    return (
        <Formik
            initialValues={{
                name: '',
                description: ''
            }}
            onSubmit={
                (values, {setSubmitting}) => {
                    setSubmitting(true);
                    dispatch(createBoard({ token: user.token, data: values }));
                    history.push('/boards');
                }
            }
            validationSchema={BoardSchema}
        >
            {(formik) =>
                <Form className={className}>
                    <div>
                        <Title>New board</Title>
                        <Subtitle>Enter basic information about this board</Subtitle>
                        <FormInputGroup label='Title' error=''>
                            <StyledInput type='text' {...formik.getFieldProps('name')} />
                        </FormInputGroup>
                        <FormInputGroup label='Description' error=''>
                            <StyledTextArea {...formik.getFieldProps('description')} />
                        </FormInputGroup>
                    </div>
                    <DefaultButton type="submit">Create</DefaultButton>

                </Form>
            }
        </Formik>

    );
}

export default styled(BoardForm)`
    padding: 1rem;
    justify-content: space-evenly;
    @media (max-width: 800px) {
        flex-direction: column;
    }
`;