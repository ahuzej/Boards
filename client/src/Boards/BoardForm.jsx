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
                    history.push('/projects');
                }
            }
            validationSchema={BoardSchema}
        >
            {(formik) =>
                <Form className={className}>
                    <div>
                        <SectionHeading title='New board' subtitle='Enter basic information about this board.' />
                        <div>
                            <span>Title:</span>
                            <StyledInput disabled={formik.isSubmitting} name='title' id='title' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.title} />
                        </div>
                        <div>
                            <span>Description:</span>
                            <StyledTextArea disabled={formik.isSubmitting} name='description' id='description' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.title} />
                        </div>
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