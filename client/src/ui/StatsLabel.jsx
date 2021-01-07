import styled from "styled-components";
import React from 'react';

function StatsLabel(props) {
    const { className, label, value } = props;

    return (
        <div className={className}>
            <label>{label}</label>
            <span>{value}</span>
        </div>
    );
}
export default styled(StatsLabel)`
    & label {
        display: block;
    }
    & span {
        font-weight: bold;
    }
`;