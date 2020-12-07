import styled from "styled-components";
import { fontSizeSm } from "./uiSettings";

function determineTextColor(color) {
    switch(color) {
        case 'sticky':
            return '#dbe4e6';
        case 'locked':
            return '#dbe4e6';
        default:
            break;
    }
}

function determineBackgroundColor(color) {
    switch(color) {
        case 'sticky':
            return '#6da1ff';
        case 'locked':
            return '#7b3fdc';
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
            return '#4e4e4e';
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