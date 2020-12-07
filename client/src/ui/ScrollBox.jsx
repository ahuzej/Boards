import styled from 'styled-components';

export default styled.div`
    overflow-y: scroll;
    max-height: ${props => props.height ? props.height : '500px'};
`;