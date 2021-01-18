import React from 'react';
import styled from 'styled-components';
import { ReactComponent as UserImage } from '../svgs/user.svg';


function ImageFrame(props) {

    const { className, component, src, onClick } = props;
    let image = null;
    if(!component && !src) {
        image = <UserImage />;
    } else if(component) {
        image = component;
    } else if(src) {
        image = <img src={src} alt='' />;
    }

    return (
        <div className={className} onClick={onClick}>
            {image}
        </div>
    );
}

export default styled(ImageFrame)`
    width: ${props => props.width ? props.width : props.size};
    height: ${props => props.height ? props.height : props.size};
    border: ${props => props.bordered ? '1px solid #ccc' : 'none'};
    & > * {
        width: 100%;
        height: 100%;
    }
    padding: ${props => props.padding ? props.padding : '4px'};
`;