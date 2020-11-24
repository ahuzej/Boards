import styled from "styled-components";

export default styled.button`
    border:1px solid ${props => props.disabled ? '#e8e8e8' : '#cac7c7'};
    padding: 8px;
    border-radius: 5px;
    width: 120px;
    color: ${props => props.disabled ? '#d0d0d0' : '#797979'};
    background-color: #e2e2e2;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    &:hover {
        transition: background-color 0.2s ease;
        transition: color 0.2s ease;
        background-color: ${props => props.disabled ? '#a8bbe2' : '#385590'};
        color: white;
    }
`;