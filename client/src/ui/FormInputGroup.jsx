import React from 'react';
import styled from 'styled-components';
import ErrorLabel from './ErrorLabel';


function FormInputGroup(props) {
    const { label, className, error, children } = props;
    return (
        <div className={className}>
            <span className='form-input-text'>{label}:</span>
            {children}
            <ErrorLabel className='form-input-error'>{error}</ErrorLabel>
        </div>
    );
}

export default styled(FormInputGroup)`
& {
    margin: 5px 0;
    > .form-input-text {
        width: 350px;
        color: #515f6b;
    }
    > *:last-child {
        display: initial;
    }
}
`;