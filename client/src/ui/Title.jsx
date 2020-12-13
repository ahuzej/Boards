import styled from 'styled-components';
import { fontSizeLg, fontSizeXl } from './uiSettings';

export default styled.h1`
    font-weight: 300;
    margin: 0;
    font-size: ${fontSizeXl};
    font-weight: bold;
    color: ${props => props.color ? props.color : props.theme.lightBg};
`;

export const Subtitle = styled.h3`
    font-weight: 300;
    margin: 0;
    font-size: ${fontSizeLg};
    color: ${props => props.color ?  props.color : '#e2e3e5'};
`;