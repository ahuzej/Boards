import React from 'react';
import styled from 'styled-components';
import Item from './Item';


function ItemList(props) {
    const { data, className } = props;
    console.log(data);
    return (
        <div className={className}>
            {data && data.map(listItem => <Item key={listItem._id} id={listItem._id} title={listItem.name} description={listItem.description} />)}
        </div>
    );
}

export default styled(ItemList)`
    width: 100%;
    & > *:not(:first-child) {
        margin-top: 8px;
    }
    & > *:not(:last-child) {
        margin-bottom: 8px;
    }
`;