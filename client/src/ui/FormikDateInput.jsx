import { useField } from 'formik';
import React from 'react';
import ReactDatePicker from 'react-datepicker';
import styled from 'styled-components';
import { StyledInput } from './FormikInput';

function FormikDateInput({className, ...props}) {
    const [field, meta, helpers] = useField(props);
    return (
        <ReactDatePicker 
            customInput={
                <StyledInput />
            }
            wrapperClassName={className} 
            style={{display: 'block', width: '100%'}} 
            {...props} {...field} 
            selected={field.value} 
            onSelect={(date) => helpers.setValue(date)} 
            onChange={(date) => helpers.setValue(date)} 
            />
    );
}

const StyledDateInput = styled(FormikDateInput)`
    display: block;
`;

export default StyledDateInput;