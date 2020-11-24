import styled from 'styled-components';
import { fontSizeLg, fontSizeXl } from './uiSettings';

export default styled.h1`
    font-weight: 300;
    margin: 0;
    color: ${props => props.dark ?  '#3e3e3e' : '#e2e3e5'};
    font-size: ${fontSizeXl};

`;

export const Subtitle = styled.h3`
    font-weight: 300;
    margin: 0;
    font-size: ${fontSizeLg};
    color: ${props => props.dark ?  '#3e3e3e' : '#e2e3e5'};
`;