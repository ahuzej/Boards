import { Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { createComment } from '../slices/commentsSlice';
import DefaultButton from '../ui/DefaultButton';
import FormikBasicInput, { StyledTextArea } from '../ui/FormikBasicInput';
import Title from '../ui/Title';

function CommentForm(props) {

    const { threadId, className } = props;
    const dispatch = useDispatch();

    async function handleSubmit(values, { resetForm }) {
        try {
            dispatch(createComment({ comment: values, threadId }));
            resetForm();
        } catch (err) {

        }
    }

    return (
        <Formik
            initialValues={
                {
                    text: '',
                    threadId
                }
            }
            onSubmit={handleSubmit}
        >
            <Form className={className}>
                <Title className='comment-title' dark>Write your comment...</Title>
                <FormikBasicInput name='text'>
                    {
                        ({ field, inError }) => { return (<StyledTextArea className='text-form' size='area' inError={inError} type="text" {...field} />) }
                    }
                </FormikBasicInput>
                <DefaultButton>Submit</DefaultButton>
            </Form>
        </Formik>
    );
}

export default styled(CommentForm)`
    & > .comment-title {
        padding-bottom: 8px;
    }
`;