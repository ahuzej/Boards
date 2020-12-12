import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fontSizeMd } from '../ui/uiSettings';


function BoardListItem(props) {
    const { id, title, description, className } = props;
    return (
        <Link className={className} to={`/boards/${id}/thread`}>
            <div className='flexed'>
                {title}
            </div>
            <p className='item-description'>
                {description}
            </p>
            <div className='item-info'>
                <p>3 new posts</p>
                <p>15 new comments</p>
            </div>
        </Link>
    );
}

export default styled(BoardListItem)`
    margin:0;
    padding: 16px;
    display: block;
    text-decoration: none;
    font-size: 1rem;
    position: relative;

    & .flexed {
        display: flex;
    }

    :hover {
        transition: background-color 0.2s ease;
        background-color: #2c57af1f;
        cursor: pointer;
    }
    & .img-container {
        width: 12px;
        height: 12px;
        margin-right: 5px;
    }

    & > .item-description {
        margin:0;
        padding-top: 8px;
        text-decoration: none;
        font-size: .8rem;
        color: #3e4384;
    }

    & > .item-info {
        position:absolute;
        right: 8px;
        top: 16px;
    }

    & > .item-info > * {
        margin: 5px 0;
        padding: 0;
        color: #797979;
        font-size: ${fontSizeMd};
        font-weight: 100;
    }
`;