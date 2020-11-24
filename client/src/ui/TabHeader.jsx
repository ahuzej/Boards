import styled from 'styled-components';

export default styled.ul`
    list-style: none;
    display: flex;
    padding-left: 0;
    margin: 0;
    margin-bottom: 1rem;
    background-color: ${props => props.theme.lightBg};
    padding-bottom: 1px;
`;