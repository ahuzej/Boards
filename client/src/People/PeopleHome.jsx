import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchUsersForBoard, usersByBoardSelector } from '../slices/usersSlice';
import AvatarPane from '../ui/AvatarPane';

function PeopleHome(props) {
    const { className, boardId } = props;

    const users = useSelector(state => usersByBoardSelector(state, boardId));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUsersForBoard({boardId: boardId}));
    }, [boardId, dispatch]);

    return (
        <div className={className}>
            <div className='people-person-list'>
                {users && users.map(person => <AvatarPane key={person._id} className='people-avatar-icon' author={person} />)}
            </div>
        </div>
    );
}

export default styled(PeopleHome)`
    & .people-person-list {
        display: flex;
    }
    .people-avatar-icon:hover {
        background-color: ${props => props.theme.hoverColor};
        transition: background-color 0.2s ease;
        transition: color 0.2s ease;
        cursor: pointer;
        color: ${props => props.theme.hoverTextColor};
    }
`;