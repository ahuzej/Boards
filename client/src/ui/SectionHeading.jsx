import React from 'react';
import styled from 'styled-components';
const Title = styled.h3`
    font-weight: 200;
    margin: 0;
    font-size: 2rem;
    color: #3f6094;
    `;
const Subtitle = styled.h5`
    font-weight: 200;
    margin: 0;
    font-size: 1rem;
    color: #808080;
`;

function SectionHeading(props) {
    const { title, subtitle } = props;
    
    return (
        <div>
            <Title>{title}</Title>
            { subtitle && <Subtitle>{subtitle}</Subtitle> }
        </div>
    );
}


export default SectionHeading;