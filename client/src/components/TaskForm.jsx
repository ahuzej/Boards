import { Form, Formik } from 'formik';
import React from 'react';
import FormikBasicInput, { StyledInput } from '../ui/FormikBasicInput';
import TitleElement from '../ui/TitleBlock';
import FormikDateInput from '../ui/FormikDateInput';
import ProjectAPI from '../api/ProjectAPI';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { Subtitle } from '../ui/Title';


function TaskForm() {
    const { id } = useParams();
    const user = useSelector(state => state.auth);

    async function handleSubmit(values) {
        const response = await ProjectAPI.createTask(user.token, values);
        console.log(response);
    }

    return (
        <Formik
            initialValues={{
                id: id,
                name: '',
                startDate: new Date(),
                endDate: ''
            }}
            onSubmit={values => {
                handleSubmit(values);
            }}>
            <Form>
                <TitleElement title='Name:'>
                    <FormikBasicInput name='name'>
                        {({ field, inError }) => { return (<StyledInput size='area' inError={inError} type="text" {...field} />) }}
                    </FormikBasicInput>
                </TitleElement>
                <TitleElement title="Start date:">
                        <FormikDateInput name="startDate" />
                    </TitleElement>
                    <TitleElement title="End date:">
                        <FormikDateInput name="endDate" />
                    </TitleElement>
                    <input type="submit" value="Create" />

            </Form>
        </Formik>
    );
}

export default TaskForm;