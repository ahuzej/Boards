import styled from 'styled-components';


export default styled.div`
    width: ${props => props.vertical ? '1px' : '100%'};
    height: ${props => props.vertical ? 'inherit' : '1px'};
    background-color: #ccc;
    margin: ${props => props.vertical ? '0' : '.5rem 0'};
`;