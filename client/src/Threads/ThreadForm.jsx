import { Form, Formik } from 'formik';
import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import DefaultButton from '../ui/DefaultButton';
import Divider from '../ui/Divider';
import Title from '../ui/Title';
import * as Yup from 'yup';
import LinkText from '../ui/LinkText';
import FormikBasicInput, { StyledInput, StyledTextArea } from '../ui/FormikBasicInput';
import { appName } from '../ui/uiSettings';
import ProjectAPI from '../api/ProjectAPI';
import { useSelector } from 'react-redux';

const ThreadSchema = Yup.object().shape({
    title: Yup.string().required('This field is required.').max(50),
    text: Yup.string().required('This field is required.').max(500)
});

function ThreadForm(props) {

    const { className, boardId, redirectTo, onSubmit } = props;
    const history = useHistory();
    const user = useSelector(state => state.auth);
    document.title = `New thread - ${appName}`;

    async function handleSubmit(values, { setSubmitting }) {
        setSubmitting(true);
        await ProjectAPI.createThread(user.token, values);
        history.push(redirectTo);
        setSubmitting(false);
        onSubmit();
    }

    return (
        <Formik
            initialValues={
                {
                    title: '',
                    text: '',
                    sticky: false,
                    locked: false,
                    boardId: boardId
                }
            }
            onSubmit={handleSubmit}
            validationSchema={ThreadSchema}
        >
            {(formik) => 
                <Form className={className}>
                    <div>
                        <LinkText onClick={() => history.goBack()}>Go back</LinkText>
                    </div>
                    <Title dark>New Thread</Title>
                    <Divider />
                    <div>
                        <span>Title:</span>
                        <FormikBasicInput name='title'>
                            {
                                ({ field, inError, props }) => { return (<StyledInput disabled={formik.isSubmitting} inError={inError} type="text" {...field} />) }
                            }
                        </FormikBasicInput>
                    </div>
                    <div>
                        <span>Text:</span>
                        <FormikBasicInput name='text'>
                            {
                                ({ field, inError, props }) => { return (<StyledTextArea disabled={formik.isSubmitting} size='area' inError={inError} type="text" {...field} />) }
                            }
                        </FormikBasicInput>
                    </div>
                    <div className='inline-blocked'>
                        <div>
                            <span>Sticky:</span>
                            <FormikBasicInput name='sticky'>
                                {
                                    ({ field, inError, props }) => { return (<input type='checkbox' inError={inError} {...field} />) }
                                }
                            </FormikBasicInput>
                        </div>
                        <div>
                            <span>Locked:</span>
                            <FormikBasicInput name='locked'>
                                {
                                    ({ field, inError, props }) => { return (<input type='checkbox' inError={inError} {...field} />) }
                                }
                            </FormikBasicInput>

                        </div>
                    </div>
                    <DefaultButton type='submit'>Submit</DefaultButton>
                </Form>
            }

        </Formik>
    );
}

export default styled(ThreadForm)`
    padding: 8px;
    & > span {
        display: block;
    }
    & .input {
        width: 100%;
        font-family: inherit;
        border:1px solid #ccc;
        border-radius: 5px;
        padding: 8px;
        font-size: .9rem;
    }
    & > .inline-blocked {
        > * {
            display: inline-block;
        }
    }
`;