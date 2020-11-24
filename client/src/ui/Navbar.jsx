import React from 'react';
import styled from 'styled-components';

function Navbar(props) {
    const { className, children } = props;

    return (
        <div className={className}>
            {children}
        </div>
    );
}

export default styled(Navbar)`
    display: flex;
    background-color: #eaeaea;
    & > * {
        margin:0 8px;
        padding: 16px;
    }
    & > *:first-child {
        font-weight: 200;
    }
    & .nav-item {
        text-decoration: none;
        color: ${props => props.theme.linkTextColor};
        font-size: .9rem;
        cursor: pointer;

    }
    & > *:not(:first-child):not(:last-child) {
        margin:0 8px;
        padding: 16px;
    }
    & > .logout-section {
        width: 100%;
        text-align: right;
    }
`