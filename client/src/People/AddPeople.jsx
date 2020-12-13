import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { addUsersToBoard, fetchUsersForBoard, userByUsernameSelector } from '../slices/usersSlice';
import AvatarCard from '../ui/AvatarCard';
import BaseInput from '../ui/BaseInput';
import DefaultButton from '../ui/DefaultButton';
import Divider from '../ui/Divider';
import ScrollBox from '../ui/ScrollBox';
import Title from '../ui/Title';
import { debounce } from 'lodash';
import { getUserStatus } from '../slices/userSlice';
import ModalLoader from '../ui/ModalLoader';

function AddPeople(props) {

    const { className, boardId } = props;
    const [peopleIds, setPeopleIds] = useState([]);

    const [contacts] = useState([]);
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');

    const users = useSelector(state => userByUsernameSelector(state, searchText, boardId));
    const usersStatus = useSelector(getUserStatus);
    console.log(usersStatus);
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
        //dispatch(getContacts({ boardId: boardId }));
    }, [boardId, dispatch]);

    function submitValues() {
        dispatch(addUsersToBoard({ users: peopleIds, boardId: boardId }));
        // values are peopleIds..
    }

    const fetchUsers = useCallback(debounce((searchText) => dispatch(fetchUsersForBoard({ username: searchText, boardId: boardId })), 500), 
        [boardId, dispatch]);

    function handleSearchChange(evt) {
        console.log('TRIGGER')
        setSearchText(evt.target.value);
    };

    useEffect(() => {
        if (searchText.length >= 3) {
            fetchUsers(searchText);
        }
    }, [boardId, dispatch, fetchUsers, searchText]);

    return (
        <div className={className}>
            <div className='add-people-form'>
                <div className='add-people-row'>
                    <Title dark>
                        Your contacts
                </Title>
                    <Divider />
                    {contacts && contacts.map(contact => <AvatarCard onSelect={handleClick} selected={peopleIds.includes(contact.id)} key={contact.id} author={contact} />)}

                </div>
                <div className='add-people-row'>
                    <Title dark>
                        Search person
                </Title>
                    <Divider />
                    <div>
                        Username:
                    <BaseInput value={searchText} onChange={handleSearchChange} />
                        <div className='bottom-toolbar'>
                        </div>
                        <ScrollBox height='500px'>
                            {usersStatus === 'loading' && <ModalLoader />}
                            {users && users.map(user => <AvatarCard onSelect={handleClick} selected={peopleIds.includes(user._id)} key={user._id} author={user} />)}
                        </ScrollBox>
                        <Divider />
                    </div>
                </div>
            </div>
            <div className='bottom-toolbar'>
                <DefaultButton onClick={submitValues} disabled={peopleIds.length === 0}>Add</DefaultButton>
            </div>

        </div>
    );
}

export default styled(AddPeople)`
    & {
        padding: 8px;
    }
    & .add-people-form {
        display: flex;
        justify-content: space-around;

        > *:first-child {
            margin-right: 8px;
        }
        > *:last-child {
            margin-left: 8px;
        }
        @media (max-width: 1200px) {
            flex-wrap: wrap;
        }

        & .add-people-row {

            @media (max-width: 1200px) {
                width: 100%;
            }
            width: 100%;
        }
    }

    & .bottom-toolbar {
        margin-top: 8px;
        text-align: right;
    }
`;