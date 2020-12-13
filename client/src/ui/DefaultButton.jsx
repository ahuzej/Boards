import styled from "styled-components";
import { fontSizeMd } from "./uiSettings";

export default styled.button`
    border:1px solid ${props => props.disabled ? '#e8e8e8' : '#cac7c7'};
    padding: 8px;
    width: 100px;
    color: ${props => props.disabled ? '#d0d0d0' : '#797979'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    background-color: transparent;
    font-size: ${fontSizeMd};
    &:hover {
        transition: background-color 0.2s ease;
        transition: color 0.2s ease;
        background-color: ${props => props.disabled ? '#a8bbe2' : '#385590'};
        color: white;
    }
`;