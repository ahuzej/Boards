import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import ProjectAPI from '../api/ProjectAPI';
import useRequest from '../hooks/useRequest';
import AvatarPane from '../ui/AvatarPane';

function PeopleHome(props) {
    const { className, boardId } = props;

    const [ people, setPeople ] = useState([]);
    const user = useSelector(state => state.auth);

    async function fetchPeople() {
        let people = await ProjectAPI.getPeople(user.token, boardId);
        console.log(people);
        setPeople(people);
    }

    const [ peopleRequestError, peopleRequestLoading, forcePeopleRequest ] = useRequest(fetchPeople, [boardId, user.token]);


    return (
        <div className={className}>
            <div className='people-person-list'>
                {people && people.map(person => <AvatarPane key={person.id} className='people-avatar-icon' author={person} />)}
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