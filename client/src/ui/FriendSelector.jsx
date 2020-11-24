import React, { useEffect, useState } from 'react';
import FriendIcon from './FriendIcon';
import { SectionBlock } from './SectionBlock';


function FriendSelector(props) {
    const { values, onChange } = props;
    console.log(values);
    const [selectedIds, setSelectedIds] = useState([]);
    const friends = values;

    function setIdSelected(id) {
        if (selectedIds.includes(id)) {
            let idIdx = selectedIds.indexOf(id);
            let newSelectedIds = Array.from(selectedIds);
            newSelectedIds.splice(idIdx, 1);
            setSelectedIds(newSelectedIds);
        } else {
            setSelectedIds(oldSelectedIds => [...oldSelectedIds, id]);
        }
    }

    useEffect(() => {
        onChange && onChange(selectedIds);
    }, [selectedIds]);

    return (
        <SectionBlock style={{ 'display': 'flex' }}>
            {friends && friends.map(friend =>
                <FriendIcon
                    key={friend.id}
                    id={friend.id}
                    name={friend.firstName}
                    setIdSelected={setIdSelected}
                    isSelected={(selectedIds.includes(friend.id))}
                />)}

        </SectionBlock>
    );
}

export default FriendSelector;