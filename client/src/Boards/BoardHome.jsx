import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useHistory, useParams, Switch, useLocation } from 'react-router';
import ProjectAPI from '../api/ProjectAPI';
import Container from '../ui/Container';
import TabHeader from '../ui/TabHeader';
import TabItem from '../ui/TabItem';
import Title from '../ui/Title';
import ThreadListPane from '../Threads/ThreadListPane';
import Divider from '../ui/Divider';
import Thread from '../Threads/Thread';
import styled from 'styled-components';
import ThreadForm from '../Threads/ThreadForm';
import PeopleHome from '../People/PeopleHome';
import AddPeople from '../People/AddPeople';
import { Link } from 'react-router-dom';
import PrivateRoute from '../ui/PrivateRoute';
import { appName } from '../ui/uiSettings';
import { getAllThreads, threadsStatusSelector } from '../slices/threadsSlice';
import { Skeleton } from '@material-ui/lab';
import { getUserSelector } from '../slices/userSlice';
import { boardByIdSelector } from '../slices/boardsSlice';

function BoardHome(props) {
    const { match, className } = props;
    const { id } = useParams();
    const user = useSelector(getUserSelector);
    const board = useSelector(state => boardByIdSelector(state, id));
    //const [threads, setThreads] = useState([]);
    const threadsStatus = useSelector(state => threadsStatusSelector(state, id));
    console.log(threadsStatus);
    const pageTitle = useRef('Loading...');
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const threadsLoaded = threadsStatus === 'complete';

    /**
     * After every render, change the page title only if board name has changed. 
     */
    useEffect(() => {
        if (board.name) {
            pageTitle.current = board.name;
        }
        document.title = `${pageTitle.current} - ${appName}`;
    }, [board.name]);

    useEffect(() => {
        dispatch(getAllThreads({boardId: id, token: user.token}));
    }, [dispatch, id, user.token]);

    function handleTabItemClick(tabValue) {
        switch (tabValue) {
            case 'boards':
                history.push(`${match.url}/thread`);
                //forceThreadInfoRequest();
                break;
            case 'people':
                history.push(`${match.url}/people`);
                break;
            default:
                break;
        }
    }

    return (
        <div className={className}>
            <Container light>
            {threadsLoaded ? <Title>{board.name}</Title> : <Skeleton width='200px' />}
            </Container>
            <TabHeader>
                <TabItem selected={location.pathname === match.url || location.pathname.includes('/thread')} onClick={evt => handleTabItemClick('boards')}>Board</TabItem>
                <TabItem selected={location.pathname.includes('/people')} onClick={evt => handleTabItemClick('people')}>People</TabItem>
            </TabHeader>
            <div>
                <Switch>
                    <Container>
                        <PrivateRoute path={`${match.url}/thread`} render={(props) => (
                            <Switch>
                                <PrivateRoute exact path={`${match.url}/thread`}>
                                    <div className='flexed'>
                                        <Title dark>Threads</Title>
                                        <Link to={`${match.url}/thread/new`}  >+ New thread...</Link>
                                    </div>
                                    <Divider />
                                    <ThreadListPane boardId={id} />
                                </PrivateRoute>
                                <PrivateRoute path={`${match.url}/thread/new`} render={(props) => (<ThreadForm {...props} boardId={id} redirectTo={`${match.url}/thread`} />)} />
                                <PrivateRoute path={`${match.url}/thread/:threadId`} component={Thread} />
                            </Switch>

                        )}>
                        </PrivateRoute>
                        <PrivateRoute path={`${match.url}/people`}>
                            <Switch>
                                <Route path={`${match.url}/people/add`} component={AddPeople} />
                                <Route exact path={`${match.url}/people/`}>
                                    <div className='flexed'>
                                        <Title dark>People</Title>
                                        <Link to={`${match.url}/people/add`}>+ Add people...</Link>
                                    </div>
                                    <Divider />
                                    <PeopleHome boardId={id} />
                                </Route>
                            </Switch>
                        </PrivateRoute>
                    </Container>
                </Switch>
            </div>
        </div>
    );
}

export default styled(BoardHome)`
    & .flexed {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }
`;