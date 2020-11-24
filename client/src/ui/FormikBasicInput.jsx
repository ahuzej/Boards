import { useField } from 'formik';
import React from 'react';
import styled from 'styled-components';

export const StyledInput = styled.input`
    border: 1px solid;
    border-radius: 5px;
    border-color: ${props => props.inError ? 'red' : '#ccc'};
    width: 100%;
    box-shadow: none;
    padding: 8px;

`;

export const StyledTextArea = styled.textarea`
    border: 1px solid;
    border-radius: 5px;
    border-color: ${props => props.inError ? 'red' : '#ccc'};
    padding: 8px;
    width: 100%;
    box-shadow: none;
    height: 150px;
    font-family: inherit;
`;

function FormikBasicInput(props) {
    const [field, meta, helpers] = useField(props);
    const { error, touched } = meta;
    const inError = touched && error;
    return (
        <>
            {props.children({ field, inError })}

            { inError && <div style={{ color: 'red' }}>
                {error}
            </div>}
        </>
    );
}


export default FormikBasicInput;