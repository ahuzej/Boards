import React from 'react';

function FormInput(props) {
    return (
        <div className='form-input'>
            <h3>{props.for}</h3>
            <input type={props.type} value={props.value} onChange={props.onChange} />
        </div>
    );
}

export default FormInput;