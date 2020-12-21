import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, Switch, useLocation } from 'react-router';
import Container from '../ui/Container';
import TabHeader from '../ui/TabHeader';
import TabItem from '../ui/TabItem';
import ThreadListPane from '../Threads/ThreadListPane';
import Divider from '../ui/Divider';
import Thread from '../Threads/Thread';
import styled from 'styled-components';
import ThreadForm from '../Threads/ThreadForm';
import PeopleHome from '../People/PeopleHome';
import AddPeople from '../People/AddPeople';
import { Link } from 'react-router-dom';
import PrivateRoute from '../ui/PrivateRoute';
import { appName, fontSizeMd } from '../ui/uiSettings';
import { getAllThreads, resetThreads, threadSortChanged, threadsSortSelector} from '../slices/threadsSlice';
import { boardByIdSelector } from '../slices/boardsSlice';
import NavigationContext from '../contexts/NavigationContext';
import { StyledInput } from '../ui/FormikBasicInput';

function BoardHome(props) {
    const { match, className } = props;
    const { id } = useParams();
    const board = useSelector(state => boardByIdSelector(state, id)) || {};
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const threadSort = useSelector(threadsSortSelector)
    const navContext = useContext(NavigationContext);

    /**
     * After every render, change the page title only if board name has changed. 
     */
    useEffect(() => {
        let title = board.name ?? 'Error!';
        document.title = `${title} - ${appName}`;
        navContext.setTitle(title);

    }, [board.name, navContext]);

    useEffect(() => {
        dispatch(getAllThreads({ boardId: id }));

        return function () {
            dispatch(resetThreads());
        }
    }, [dispatch, id]);

    function handleTabItemClick(tabValue) {
        switch (tabValue) {
            case 'boards':
                history.push(`${match.url}/thread`);
                break;
            case 'people':
                history.push(`${match.url}/people`);
                break;
            default:
                break;
        }
    }

    function handleChange(evt) {
        dispatch(threadSortChanged(evt.target.value));
    }

    return (
        <div className={className}>
            <TabHeader>
                <TabItem selected={location.pathname === match.url || location.pathname.includes('/thread')} onClick={evt => handleTabItemClick('boards')}>Board</TabItem>
                <TabItem selected={location.pathname.includes('/people')} onClick={evt => handleTabItemClick('people')}>People</TabItem>
            </TabHeader>
            <div>
                <Switch>
                    <Container padding='8px'>
                        <PrivateRoute path={`${match.url}/thread`} render={(props) => (
                            <Switch>
                                <PrivateRoute exact path={`${match.url}/thread`}>
                                    <div className='action-control'>
                                        Sort:
                                        <StyledInput value={threadSort ?? ''} as='select' onChange={handleChange}>
                                            <option value='none'>Default</option>
                                            <option value='dateNew'>Date - newest</option>
                                            <option value='dateOld'>Date - oldest</option>
                                        </StyledInput>
                                    </div>
                                    <div className='flexed'>
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
                                <PrivateRoute path={`${match.url}/people/add`} render={(props) => <AddPeople {...props} boardId={id} />} />
                                <PrivateRoute exact path={`${match.url}/people/`}>
                                    <div className='flexed'>
                                        <Link to={`${match.url}/people/add`}>+ Add people...</Link>
                                    </div>
                                    <Divider />
                                    <PeopleHome boardId={id} />
                                </PrivateRoute>
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
        text-align: right;
        font-size: ${fontSizeMd};
    }
    .dropdown-sort {
        width: 300px;
    }
    & .action-control {
        font-size: ${fontSizeMd};
        width: 250px;
    }
    @media (max-width: 700px) {
        .dropdown-sort {
            width: 100%;
        }
    }
`;