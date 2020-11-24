import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import TitleElement from '../ui/TitleBlock';
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../actions/projectsActions';
import * as Yup from 'yup';
import SectionHeading from '../ui/SectionHeading';
import styled from 'styled-components';
import UserAPI from '../api/UserAPI';
import FormikBasicInput, { StyledInput, StyledTextArea } from '../ui/FormikBasicInput';
import DefaultButton from '../ui/DefaultButton';
import { useHistory } from 'react-router';

const BoardSchema = Yup.object().shape({
    name: Yup.string().required('Required field'),
    description: Yup.string(),
    dateTime: Yup.date()
}
);

function BoardForm(props) {
    const { className } = props;
    console.log(props);
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth);
    const [contacts, setContacts] = useState([]);
    const history = useHistory();

    useEffect(() => {
        async function fetch() {
            const response = await UserAPI.getContacts(user.token, user.id);
            setContacts(response);
        }
        fetch();

    }, [user.id]);

    return (
        <Formik
            initialValues={{
                name: '',
                description: '',
                dateTime: new Date(),
            }}
            onSubmit={
                (values, {setSubmitting}) => {
                    setSubmitting(true);
                    dispatch(createProject({ token: user.token, data: values }));
                    history.push('/projects');
                }
            }
            validationSchema={BoardSchema}
        >
            {(formik) =>
                <Form className={className}>
                    <div>
                        <SectionHeading title='Basic information' subtitle='Enter basic information about this project.' />
                        <TitleElement title="Title:">
                            <FormikBasicInput name="name">
                                {
                                    ({ field, inError }) => { return (<StyledInput size='area' inError={inError} type="text"  disabled={formik.isSubmitting} {...field} />) }
                                }
                            </FormikBasicInput>
                        </TitleElement>
                        <TitleElement title="Description:" >
                            <FormikBasicInput name="description">
                                {
                                    ({ field, inError, props }) => { return (<StyledTextArea size='area' inError={inError} type="text" disabled={formik.isSubmitting} {...field} />) }
                                }
                            </FormikBasicInput>
                        </TitleElement>
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