import styled from 'styled-components';
import { fontSizeMd } from './uiSettings';

export default styled.li`

    &:hover {
        cursor: pointer;
    }
    padding: 1rem;
    color: ${props => props.selected ? '#b7d3ff' : '#eaeaea'};
    border-bottom: ${props => props.selected ? '2px solid #b7d3ff' : 'none'};
    font-weight: ${props => props.selected ? 'bold' : 'initial'};
    font-size: ${fontSizeMd};
    transition: all 0.15s ease;
`;