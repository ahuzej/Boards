import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useArrayPaging from '../hooks/useArrayPaging';
import useQuery from '../hooks/useQuery';
import { getAllBoards, getBoardsSelector } from '../slices/boardsSlice';
import { getUserSelector } from '../slices/userSlice';
import ActivityItem from '../ui/ActivityItem';
import Divider from '../ui/Divider';
import { StyledInput } from '../ui/FormikInput';
import ItemList from '../ui/ItemList';
import LinkText from '../ui/LinkText';
import Title, { Subtitle } from '../ui/Title';
import { appName, fontSizeMd } from '../ui/uiSettings';

const author = {
    id: 1,
    username: 'pperic',
    firstName: 'Pero',
    lastName: 'Peric',
    joinedAt: '30.10.2020'
};


function ProjectList(props) {

    document.title = `Boards - ${appName}`;

    const { className, match } = props;

    const projects = useSelector(getBoardsSelector);
    console.log(projects);
    const query = useQuery();
    const page = query.get('page') ? +query.get('page') : 1;
    const [pagedValues, totalPageNumber] = useArrayPaging(projects, 10, page);
    const history = useHistory();
    const user = useSelector(getUserSelector);
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetch = async () => {
            await dispatch(getAllBoards({ id: user.id, token: user.token }));
        }
        fetch();
    }, [dispatch, user.id, user.token]);

    function changeCurrentPage(nextPage) {
        history.push({
            search: `?page=${nextPage}`
        })
    }

    return (
        <div className={className}>
            <div className='board-list-section'>
                <div className='flexed-title'>
                    <Title dark>Your boards</Title>
                    <div className='navigation-controls'>
                        Search:
                        <StyledInput></StyledInput>
                        <Link to='/projects/new'>
                            New board...
                        </Link>
                    </div>
                </div>
                <Divider />
                <div className='content-section'>
                    <ItemList data={pagedValues} />
                    <div className='activity-section'>
                        <div className='flexed-title'>
                            <Subtitle dark>Latest activity</Subtitle>
                        </div>
                        <div className='activity-item-list'>
                            <ActivityItem title='Buhuu / New patch update!' author={author} text='Hmm, it was funny that h...' time='5min' img={null} />
                            <ActivityItem title='Buhuu / New patch update!' author={author} text='Haha well definently there wa..' time='12min' img={null} />
                            <ActivityItem title='Buhuu / New patch update!' author={author} text='Bla' time='19min' img={null} />
                            <ActivityItem title='Buhuu / New patch update!' author={author} text='Bla' time='23min' img={null} />

                        </div>

                    </div>
                </div>
                <div className='board-navigation'>
                    {page !== 1 && totalPageNumber > 1 && <LinkText onClick={(evt) => changeCurrentPage(page - 1)}>Previous page</LinkText>}
                    {totalPageNumber > page && <LinkText onClick={(evt) => changeCurrentPage(page + 1)}>Next page</LinkText>}
                </div>
            </div>
        </div>
    );
}

export default styled(ProjectList)`
    display: flex;
    justify-content: space-evenly;
    & > * {
        padding: 8px;
    }
    & > .board-list-section {
        flex-grow: 2;
    }
    & > .activity-section {
        flex-grow: .2;
    }
    & > .board-list-section > .content-section {
        display: flex;
        justify-content: space-around;

        > *:first-child {
            margin-right: 16px;
        }
        > *:last-child {
            margin-left: 16px;
        }
    }
    
    .flexed-title {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }
    & > .board-list-section > .flexed-title > .navigation-controls {
        font-size: ${fontSizeMd};
        width: 250px;
    }
    & .avatar-image {
        width: 20px;
        height: 20px;
        border:1px solid #ccc;
    }
    .activity-item-list {
        font-size: ${fontSizeMd};
        width: 250px;
        
    }
    .activity-item-list > * {
        margin: 8px 0;
    }
    .activity-item {
        display: flex;
    }
`;