import React from 'react';
import styled from 'styled-components';
import Task from './Task';
import { Subtitle } from './Title';



function TaskList(props) {
    const { items, className } = props;

    return (
        <div className={className}>
            {items && items.map(item => <Task key={item.id} name={item.name} deadlineIn={item.deadlineIn} />)}
        </div>
    );
}

export default styled(TaskList)`
`;