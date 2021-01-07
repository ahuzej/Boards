import React from 'react';
import styled from 'styled-components';
import { ReactComponent as UserImage } from '../svgs/user.svg';


function ImageFrame(props) {

    const { className, component, src, onClick } = props;

    return (
        <div className={className} onClick={onClick}>
            {!component && !src && <UserImage />}
            {component ? component : <img src={src} alt='' /> }
        </div>
    );
}

export default styled(ImageFrame)`
    width: ${props => props.size};
    height: ${props => props.size};
    border: ${props => props.bordered ? '1px solid #ccc' : 'none'};
    & > * {
        width: 100%;
    }
    padding: 4px;
`;