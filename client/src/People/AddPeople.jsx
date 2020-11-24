import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getContacts } from '../actions/authActions';
import AvatarCard from '../ui/AvatarCard';
import BaseInput from '../ui/BaseInput';
import DefaultButton from '../ui/DefaultButton';
import Divider from '../ui/Divider';
import Title from '../ui/Title';

const peopleArr = [
    {
        id: 1,
        username: 'pperic',
        firstName: 'Pero',
        lastName: 'Peric',
        joinedAt: '30.10.2020'
    },
    {
        id: 2,
        username: 'mmajic',
        firstName: 'Maja',
        lastName: 'Majic',
        joinedAt: '30.11.2020'
    },
    {
        id: 3,
        username: 'jjosip',
        firstName: 'Josip',
        lastName: 'Josipovic',
        joinedAt: '11.10.2020'
    },
];


function AddPeople(props) {

    const { className } = props;
    const [peopleIds, setPeopleIds] = useState([]);

    const [ contacts, setContacts ] = useState([]);
    const user = useSelector(state => state.auth);
    const dispatch = useDispatch();

    function handleClick(id) {
        let prevValues = [...peopleIds];
        if (!peopleIds.includes(id)) {
            prevValues = [...prevValues, id];
        } else {
            const index = prevValues.indexOf(id);
            prevValues.splice(index, 1)
            setPeopleIds(prevValues);
        }
        setPeopleIds(prevValues);
    }

    useEffect(() => {
        console.log('do dispatch')
        dispatch(getContacts());
    }, [dispatch, user.id]);

    function submitValues() {
        // values are peopleIds..
    }

    return (
        <div className={className}>
            <div className='add-people-row'>
                <Title dark>
                    Your contacts
                </Title>
                <Divider />
                {contacts && contacts.map(contact => <AvatarCard onSelect={handleClick} selected={peopleIds.includes(contact.id)} key={contact.id} author={contact} />)}
                <div className='bottom-toolbar'>
                    <DefaultButton onClick={submitValues} disabled={peopleIds.length === 0}>Add</DefaultButton>
                </div>
            </div>
            <div className='add-people-row'>
                <Title dark>
                    Search person
                </Title>
                <Divider />
                <div>
                    Username:
                    <BaseInput />
                    <div className='bottom-toolbar'>
                </div>
                <Divider />
                <div className='bottom-toolbar'>
                    <DefaultButton onClick={submitValues}>Add</DefaultButton>
                </div>

                </div>
            </div>
            <div className='add-people-row'>
                <Title dark>
                    Invite by email
                </Title>
                <Divider />
                <div>
                    Email:
                    <BaseInput />
                    <div className='bottom-toolbar'>
                    <DefaultButton>Send</DefaultButton>
                </div>

                </div>
            </div>
        </div>
    );
}

export default styled(AddPeople)`
    & {
        display: flex;
        justify-content: space-around;
        padding: 8px;

        @media (max-width: 1200px) {
            flex-wrap: wrap;
        }

        & .add-people-row {

            @media (max-width: 1200px) {
                width: 100%;
            }
            width: 100%;
            padding: 8px;    
        }
        & .bottom-toolbar {
            margin-top: 8px;
        }
    }
`;