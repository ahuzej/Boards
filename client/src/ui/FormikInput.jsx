import { useField } from 'formik';
import React from 'react';
import styled from 'styled-components';

export const StyledInput = styled.input`
    border: 1px solid;
    border-color: ${props => props.inError ? 'red' : '#ccc'};
    padding: 8px;
    width: 100%;
    box-shadow: none;
`;


function FormikInput(props) {
    const [field, meta, helpers] = useField(props);
    const { error, touched } = meta;
    const inError = touched && error;
    console.log(helpers);
    return (
        <>
            <StyledInput size='area' inError={inError} type="text" {...field} {...props} />
            { inError && <div style={{ color: 'red' }}>
                {error}
            </div>}
        </>
    );
}


export default FormikInput;