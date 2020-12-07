import styled from "styled-components";
import { fontSizeSm } from "./uiSettings";
const Container = styled.div`
padding: ${props => props.padding ? props.padding : '16px'};
& .subtitle {
    font-size: ${fontSizeSm};
    font-weight: 100;
    margin:0;
    padding:0;
}
border: ${props => props.bordered ? '1px solid #ccc' : 'initial'};
background-color: ${props => props.light ? props.theme.lightBg : 'initial'};
`;
export default Container;