import React from 'react';
import styled from 'styled-components';
import { Subtitle } from './Title';

const ItemWrapper = styled.div`
`;

function Task(props) {
    const { id, name, deadlineIn } = props;
    
    return (
        <ItemWrapper>
            <Subtitle>
                {name}
            </Subtitle>
            <div>
                {deadlineIn}
            </div>
        </ItemWrapper>
    );
}

export default styled(Task)`
background-color: ${props => props.theme.lightBg};
`;