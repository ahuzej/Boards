import React from 'react';
import Input from '@material-ui/core/Input';

function FormInput(props) {
    return (
        <Input variant="outlined" type={props.type} value={props.value} onChange={props.onChange} {...props} />
    );
}

export default FormInput;