import styled from "styled-components";
import { fontSizeSm } from "./uiSettings";

function determineTextColor(color) {
    switch(color) {
        case 'sticky':
            return '#fff';
        case 'locked':
            return '#ffd2e9';
        default:
            break;
    }
}

function determineBackgroundColor(color) {
    switch(color) {
        case 'sticky':
            return '#21b3d4';
        case 'locked':
            return '#d0448b';
        default:
            break;
    }
    return color;
}

function determineBorderColor(color) {
    switch(color) {
        case 'sticky':
            return '#248094';
        case 'locked':
            return '#d0448b';
        default:
            break;
    }
    return color;
}

export default styled.span`
    display: inline-block;
    padding: 5px;
    color: ${({color}) => determineTextColor(color)};
    border: 1px solid ${({color}) => determineBorderColor(color)};
    background-color: ${({color}) => determineBackgroundColor(color)};
    font-size: ${fontSizeSm};
`;