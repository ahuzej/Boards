import React from 'react';
import styled from 'styled-components';
import Divider from './Divider';

const StyledImage = styled.img`
    display: block;
    padding: 1rem 0 .5rem 0;
    margin-bottom: 1rem;
`;
const StyledItemContainer = styled.div`
    text-align: center;
    padding: 8px;
    width: 100px;
    border: 1px solid ${props => props.selected ? 'red' : '#ccc'}
`;

function FriendIcon(props) {

    const { isSelected, setIdSelected } = props;
    const { id, name } = props;

    function handleClick(evt) {
        setIdSelected(id);
    }

    return (
        <StyledItemContainer selected={isSelected} onClick={handleClick}>
            <div style={{margin: '0 auto', width: 50}}>
                <StyledImage src={process.env.PUBLIC_URL + '/images/user.svg'} />
            </div>
            <Divider />
            <div style={{ margin: '16px 0' }}>
                {name}
            </div>
        </StyledItemContainer>
    );
}

export default FriendIcon;