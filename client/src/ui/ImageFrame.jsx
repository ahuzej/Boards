import React from 'react';
import styled from 'styled-components';


function ImageFrame(props) {

    const { className, src } = props;
    return (
        <div className={className}>
            <img src={src} alt='' />
        </div>
    );
}

export default styled(ImageFrame)`
    width: ${props => props.size};
    height: ${props => props.size};
    border: ${props => props.bordered ? '1px solid #ccc' : 'none'};
    & > img {
        width: 100%;
    }

`;