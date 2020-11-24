import React from 'react';
import { Subtitle } from './Title';

function TitledContainer(props) {
    const { title, children} = props;

    return (
        <div>
            <div>
                <Subtitle>{title}</Subtitle>
            </div>
            {children}
        </div>
    );
}

export default TitledContainer;