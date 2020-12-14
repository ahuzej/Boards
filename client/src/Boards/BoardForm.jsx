import { Form, Formik } from 'formik';
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import styled from 'styled-components';
import { StyledInput, StyledTextArea } from '../ui/FormikBasicInput';
import DefaultButton from '../ui/DefaultButton';
import { useHistory } from 'react-router';
import { createBoard, getBoardsErrorSelector } from '../slices/boardsSlice';
import Title, { Subtitle } from '../ui/Title';
import FormInputGroup from '../ui/FormInputGroup';
import ErrorLabel from '../ui/ErrorLabel';
import Divider from '../ui/Divider';

const BoardSchema = Yup.object().shape({
    name: Yup.string().required('This field is required'),
    description: Yup.string()
}
);

function BoardForm(props) {
    const { className } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const boardsError = useSelector(getBoardsErrorSelector);

    return (
        <Formik
            initialValues={{
                name: '',
                description: ''
            }}
            onSubmit={
                (values, { setSubmitting }) => {
                    setSubmitting(true);
                    dispatch(createBoard({ data: values, onOk: () => { history.push('/boards'); }, onError: () => { setSubmitting(false); } }));
                }
            }
            validationSchema={BoardSchema}
        >
            {(formik) =>
                <Form className={className}>
                    <div>
                        <Title>New board</Title>
                        <Subtitle color='#515f6b'>Enter basic information about this board</Subtitle>
                        <Divider />
                        <FormInputGroup label='Title' error={formik.touched.name && formik.errors.name}>
                            <StyledInput
                                inError={formik.touched.name && formik.errors.name}
                                type='text'
                                {...formik.getFieldProps('name')} />
                        </FormInputGroup>
                        <FormInputGroup label='Description' error={formik.touched.description && formik.errors.description}>
                            <StyledTextArea
                                inError={formik.touched.description && formik.errors.description}
                                type='text'
                                {...formik.getFieldProps('description')} />
                        </FormInputGroup>
                    </div>
                    <DefaultButton type="submit">Create</DefaultButton>
                    {boardsError && <div><ErrorLabel>{boardsError}</ErrorLabel></div>}

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