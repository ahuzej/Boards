import React, { useState } from 'react';
import styled from 'styled-components';
import FolderPaneItem from './FolderPaneItem';
import { Subtitle } from './Title';

const FolderPaneChildContainer = styled.div`
    > * {
        padding: 5px;
        padding-left: 16px;
        font-weight: 300;
        color: #292929;
    }
`;

function FolderPaneSection(props) {
    const { title, children } = props;
    const [visible, setVisible] = useState(true);

    return (
        <div>
            <FolderPaneItem 
                iconPath={visible ? `${process.env.PUBLIC_URL}/images/down-arrow.svg` 
                        : `${process.env.PUBLIC_URL}/images/right-arrow.svg`}>
                <Subtitle onClick={evt => setVisible(!visible)}>{title}</Subtitle>
            </FolderPaneItem>
            { visible && <FolderPaneChildContainer>
                {children}
            </FolderPaneChildContainer>}
        </div>
    );
}

export default FolderPaneSection;