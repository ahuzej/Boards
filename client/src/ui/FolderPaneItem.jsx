import React from 'react';
import styled from 'styled-components';

const ContainedImage = styled.img`
    max-width: 12px;
    min-width: 12px;
    margin-right: 5px;
    visibility: ${props => props.src ? 'visible' : 'hidden'};
`;

function FolderPaneItem(props) {
    const { children, iconPath, className } = props;

    return (
        <div className={className}>
            {<ContainedImage src={iconPath} alt='' /> }
            {children}
        </div >
    );
}

export default styled(FolderPaneItem)`
    display: flex;
    
`;