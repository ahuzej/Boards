import React from 'react';
import { SectionBlock } from './SectionBlock';
import { Subtitle } from './Title';


function TitleElement(props) {
    const { title, children } = props;
    return (
        <SectionBlock>
            <Subtitle>{title}</Subtitle>
            {children}
        </SectionBlock>
    );
}

export default TitleElement;