import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import DefaultButton from "../ui/DefaultButton";
import Divider from "../ui/Divider";
import Title from "../ui/Title";
import * as Yup from "yup";
import LinkText from "../ui/LinkText";
import { StyledInput, StyledTextArea } from "../ui/FormikBasicInput";
import { appName, maxCommentSize } from "../ui/uiSettings";
import { useDispatch, useSelector } from "react-redux";
import { createThread, threadsStatusSelector } from "../slices/threadsSlice";
import { getUserSelector } from "../slices/userSlice";
import FormInputGroup from "../ui/FormInputGroup";
import ModalLoader from "../ui/ModalLoader";

const ThreadSchema = Yup.object().shape({
  title: Yup.string().required("This field is required.").max(50),
  text: Yup.string().required("This field is required.").max(maxCommentSize),
});

function ThreadForm(props) {
  const { className, boardId, redirectTo } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(getUserSelector);
  const threadsStatus = useSelector(threadsStatusSelector);

  document.title = `New thread - ${appName}`;

  function handleSubmit(values, { setSubmitting }) {
    setSubmitting(true);
    dispatch(
      createThread({
        token: user.token,
        data: values,
        onOk: () => {
          history.push(redirectTo);
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
        title: "",
        text: "",
        sticky: false,
        locked: false,
        boardId: boardId,
      }}
      onSubmit={handleSubmit}
      validationSchema={ThreadSchema}
    >
      {(formik) => (
        <Form className={className}>
          {threadsStatus === "loading" && <ModalLoader />}

          <div>
            <LinkText onClick={() => history.goBack()}>Go back</LinkText>
          </div>
          <Title dark>New Thread</Title>
          <Divider />
          <div>
            <FormInputGroup label="Title">
              <StyledInput
                inError={formik.touched.title && formik.errors.title}
                type="text"
                disabled={formik.isSubmitting}
                {...formik.getFieldProps("title")}
              />
            </FormInputGroup>
          </div>
          <div>
            <FormInputGroup label="Text">
              <StyledTextArea
                inError={formik.touched.title && formik.errors.title}
                type="text"
                disabled={formik.isSubmitting}
                {...formik.getFieldProps("text")}
              />
            </FormInputGroup>
          </div>
          <div>
            <div className="inlined">
              <span className="text-label">Sticky:</span>
              <input disabled={formik.isSubmitting} type="checkbox" {...formik.getFieldProps("sticky")} />
            </div>
            <div className="inlined">
              <span className="text-label">Locked:</span>
              <input disabled={formik.isSubmitting} type="checkbox" {...formik.getFieldProps("locked")} />
            </div>
          </div>
          <DefaultButton disabled={formik.isSubmitting} type="submit">Submit</DefaultButton>
        </Form>
      )}
    </Formik>
  );
}

export default styled(ThreadForm)`
  padding: 8px;
  & > span {
    display: block;
  }
  & .text-label {
    color: #515f6b;
  }
  & .input {
    width: 100%;
    font-family: inherit;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 8px;
    font-size: 0.9rem;
  }
  & .inlined {
    display: inline-block;
  }
`;
