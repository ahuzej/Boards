import styled from "styled-components";
import React from 'react';
import { fontSizeLg } from "./uiSettings";
import { ReactComponent as UserImage } from '../svgs/user.svg';

function AvatarPane(props) {
    const { className } = props;
    const author = props.author ?? {};
    
    return (
        <div className={className}>
            <div className='avatar-image'>
                <UserImage fill='#ccc' width='50px' height='50px' />
            </div>
            <div className='avatar-details'>
                <span className='avatar-username'>
                    {author.username}
                </span>
            </div>
        </div>
    );
}

export default styled(AvatarPane)`
    display: block;
    width: 150px;
    padding: 8px;
    color: ${props => props.theme.blackTextColor};
    & .avatar-image {
        width: 75px;
        height: 75px;
        border:1px solid #ccc;
        margin: 8px auto;
        position: relative;
        > * {
            position: absolute;
            transform: translate(50%,-50%);
            top: 50%; right: 50%;

        }
    }

    & .avatar-details {
        width: 100%;
        text-align:center;

        & .avatar-username {
            padding-bottom: 8px;
            font-size: ${fontSizeLg};
        }
    }
`;