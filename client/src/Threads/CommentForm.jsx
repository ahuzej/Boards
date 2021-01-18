import { Form, Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  createComment,
  getCommentsErrorSelector,
} from "../slices/commentsSlice";
import DefaultButton from "../ui/DefaultButton";
import { StyledTextArea } from "../ui/FormikBasicInput";
import Title from "../ui/Title";
import * as Yup from "yup";
import ErrorLabel from "../ui/ErrorLabel";
import { incrementCommentCount } from "../slices/threadsSlice";

const CommentSchema = Yup.object().shape({
  text: Yup.string()
    .required("Comment can't be empty.")
    .min(1)
    .max(3000, (obj) => `Text must not be longer than ${obj.max} characters`),
});

function CommentForm(props) {
  const { threadId, className } = props;
  const dispatch = useDispatch();
  const commentError = useSelector(getCommentsErrorSelector);

  function handleSubmit(values, { resetForm, setSubmitting }) {
    setSubmitting(true);
    dispatch(
      createComment({
        comment: values,
        threadId,
        onOk: () => {
          resetForm();
          dispatch(incrementCommentCount(threadId));
        },
        onError: () => {
          setSubmitting(false);
        },
      })
    );
  }

  return (
    <Formik
      initialValues={{
        text: "",
        threadId,
      }}
      onSubmit={handleSubmit}
      validationSchema={CommentSchema}
    >
      {(formik) => (
        <Form className={className}>
          <Title className="comment-title" dark>
            Write your comment...
          </Title>
          <StyledTextArea
            inError={formik.errors.text}
            {...formik.getFieldProps("text")}
            disabled={formik.isSubmitting}
          />
          {formik.errors.text && (
            <div>
              <ErrorLabel>{formik.errors.text}</ErrorLabel>
            </div>
          )}
          <DefaultButton disabled={formik.isSubmitting}>Submit</DefaultButton>
          {commentError && (
            <div>
              <ErrorLabel>{commentError}</ErrorLabel>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}

export default styled(CommentForm)`
  & > .comment-title {
    padding-bottom: 8px;
  }
`;
