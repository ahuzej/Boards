import React, { useState } from 'react';
import styled from 'styled-components';

const FolderButton = styled.input`
cursor: pointer;
background-color: ${props => !props.selected ? props.theme.lightBg : '#4f87dc'};
padding: 10px;
box-shadow: none;
border: 1px solid #b9b9b9;
color: #f8f8f8;
min-width: 100px;
transition: background-color 0.15s ease;
border-radius: 5px;
margin:0 2px;
`;

function FolderPane(props) {
    const { children, className } = props;

    const [selected, setSelected] = useState(0);

    return (
        <div className={className}>
            <div className='title-block'>
                <h3 className='title'>Tasks</h3>
                <div>
                    <FolderButton type='button' value='Category' onClick={evt => setSelected(0)} selected={selected === 0} />
                    <FolderButton type='button' value='Date' onClick={evt => setSelected(1)} selected={selected === 1} />
                    <FolderButton type='button' value='Status' onClick={evt => setSelected(2)} selected={selected === 2} />
                </div>
            </div>
            <div className='children-block'>
                {children}
            </div>
        </div>

    );
}

export default styled(FolderPane)`
    border:1px solid #ccc;

    & .title-block {
        padding: 8px;
        border-bottom:1px solid #ccc;
        display: flex;
        align-items: baseline;
        align-content: baseline;
        justify-content: space-between;
        background-color: ${props => props.theme.lightBg};

        & .title {
            padding: 0;
            margin: 0;
            font-weight: 300;
            background-color: ${props => props.theme.lightBg};
            color: #f8f8f8;
        }
    }
    & .children-block {
        padding: 8px;
    }
`;