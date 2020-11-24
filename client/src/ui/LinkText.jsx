import styled from "styled-components";

export default styled.span`
    cursor: ${props => props.selected ? 'initial' : 'pointer'};
    color: ${props => props.selected ? props.theme.blackTextColor : props.theme.linkTextColor};
    text-decoration: ${props => props.selected ? 'initial' : 'underline'};
`;