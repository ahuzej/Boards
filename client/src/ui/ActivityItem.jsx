import React from 'react';
import styled from 'styled-components';
import LinkText from './LinkText';

function ActivityItem (props) {
    const { className, author, title, text, time} = props;

    return (
        <div className={className} >
            <div className='activity-header'>
                <LinkText>{title}</LinkText>
                <div>{author.username}</div>
                <span className='activity-time'>{time}</span>
            </div>
            <div className='activity-body'>
                {text}
            </div>
        </div>
    );
}

export default styled(ActivityItem)`
    & > .activity-header {
        position: relative;
        font-size: .9rem;
        color: #6d6d6d;
    }
    & .activity-time {
        position: absolute;
        top: 0;
        right: 0;
    }
    &:hover {
        transition: background-color 0.2s ease;
        background-color: ${props => props.theme.hoverColor};
        color: ${props => props.theme.hoverTextColor};
        cursor: pointer;
    }
`;