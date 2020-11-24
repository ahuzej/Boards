import styled from "styled-components";
import React from 'react';

function AvatarCard(props) {
    const { author, className, onSelect } = props;
    return (
        <div className={className} onClick={() => onSelect(author.id)}>
            <div className='avatar-image'>
            </div>
            <div className='avatar-details'>
                <span className='avatar-username'>{author.username}</span>
            </div>
        </div>
    );
}

export default styled(AvatarCard)`
    display: flex;
    align-content: center;
    align-items: center;
    width: 100%;
    padding: 8px;
    color: ${props => props.selected ? '#6f6f6f' : props.theme.blackTextColor};
    background-color: ${props => props.selected ? '#d9ffd6' : 'initial'};
    border: ${props => props.selected ? '1px solid #e4e4e4' : '1px solid #fff'};
    margin: 2px 0;
    & .avatar-image {
        width: 50px;
        height: 50px;
        border:1px solid #ccc;
        margin-right: 16px;
    }

    & .avatar-details {
        width: 100%;

        & .avatar-username {
            padding-bottom: 8px;
        }
    }
    &:hover {
        transition: background-color 0.2s ease;
        background-color: ${props => props.theme.hoverColor};
        color: ${props => props.theme.hoverTextColor};
        cursor: pointer;
    }
`;