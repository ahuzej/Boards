import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
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
import useRequest from '../hooks/useRequest';
import { Skeleton } from '@material-ui/lab';

function ProjectHome(props) {

    const { match, className } = props;
    const { id } = useParams();
    const user = useSelector(state => state.auth);
    const [board, setBoard] = useState({});
    const [threads, setThreads] = useState([]);
    const pageTitle = useRef('Loading...');

    const location = useLocation();
    const history = useHistory();

    async function fetchBoardInfo() {
        try {
            if (id && user.token) { // don't attempt to data fetch if board id and token are not defined
                const response = await ProjectAPI.getById(user.token, id);
                console.log(response);
                setBoard(response);
            }
        } catch (err) {
            pageTitle.current = 'Error!';
        }
    }

    async function fetchThreadsInfo() {
        try {
            if(id && user.token) {
                let threads = await ProjectAPI.getThreads(user.token, id);
                console.log(threads);
                setThreads(threads);
            }
        } catch (err) {
            pageTitle.current = 'Error!';
        }
    }

    /**
     * After every render, fetch information about the current board id only if the board id has changed, or the user token has changed.
     */
    const [ boardRequestError, boardRequestLoading, forceBoardInfoRequest ] = useRequest(fetchBoardInfo, [id, user.token]);

    /**
     * After every render, fetch threads for current board id only if the board id has changed, or the user token has changed.
     */
    const [ threadsRequestError, threadsRequestLoading, forceThreadInfoRequest ] = useRequest(fetchThreadsInfo, [id, user.token]);

    /**
     * After every render, change the page title only if board name has changed. 
     */
    useEffect(() => {
        if (board.name) {
            pageTitle.current = board.name;
        }
        document.title = `${pageTitle.current} - ${appName}`;
    }, [board.name])

    function handleTabItemClick(tabValue) {
        switch (tabValue) {
            case 'boards':
                history.push(`${match.url}/thread`);
                forceThreadInfoRequest();
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
            {!boardRequestLoading ? <Title>{board.name}</Title> : <Skeleton width='200px' />}
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
                                    <ThreadListPane threads={threads} />
                                </PrivateRoute>
                                <PrivateRoute path={`${match.url}/thread/new`} render={(props) => (<ThreadForm {...props} boardId={id} onSubmit={forceThreadInfoRequest} redirectTo={`${match.url}/thread`} />)} />
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

export default styled(ProjectHome)`
    & .flexed {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }
`;