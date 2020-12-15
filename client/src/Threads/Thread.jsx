import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Container from '../ui/Container';
import Title, { Subtitle } from '../ui/Title';
import ThreadComment from './ThreadComment';
import styled from 'styled-components';
import CommentForm from './CommentForm';
import LinkText from '../ui/LinkText';
import Moment from 'react-moment';
import { dateFormat } from '../ui/uiSettings';
import { threadByIdSelector, threadsStatusSelector, updateThreadLock, updateThreadSticky } from '../slices/threadsSlice';
import { commentsPagingSelector, commentsStatusSelector, getAllComments } from '../slices/commentsSlice';
import usePaging from '../hooks/usePaging';
import NavigationContext from '../contexts/NavigationContext';
import DefaultButton from '../ui/DefaultButton';

function Thread(props) {
    const { className } = props;
    const { threadId } = useParams();
    const navContext = useContext(NavigationContext);
    const itemsPerPage = 10;
    const [page, changeCurrentPage] = usePaging('page');
    const { items: comments, totalAmountOfPages } = useSelector(state => commentsPagingSelector(state, page, itemsPerPage));
    const dispatch = useDispatch();
    const thread = useSelector(state => threadByIdSelector(state, threadId)) || {};
    const threadsStatus = useSelector(threadsStatusSelector);
    const commentsStatus = useSelector(commentsStatusSelector);
    // Paging thread comments
    const pageNumbers = [...Array(totalAmountOfPages + 1).keys()].slice(1);
    useEffect(() => {
        dispatch(
            getAllComments(
                { threadId }
            )
        );
    }, [dispatch, threadId]);

    function lockButtonClick() {
        dispatch(updateThreadLock({locked: !thread.locked, threadId: thread._id}));
    }

    function stickyButtonClick() {
        dispatch(updateThreadSticky({sticky: !thread.sticky, threadId: thread._id}));
    }

    useEffect(() => {
        if (commentsStatus === 'failed') {
            navContext.setTitle('Error!');
        }
    }, [commentsStatus, navContext]);

    return (
        <div className={className}>
            <Container light>
                <Title color='white'>{thread.title}</Title>
                {thread.dateTime && <Subtitle light><Moment format={dateFormat}>{thread.dateTime}</Moment></Subtitle>}
                <div className='action-controls'>
                    <DefaultButton onClick={lockButtonClick}>{thread.locked ? 'Unlock' : 'Lock'}</DefaultButton>
                    <DefaultButton onClick={stickyButtonClick}>{thread.sticky ? 'Unsticky' : 'Sticky'}</DefaultButton>
                </div>
            </Container>
            <Container>
                <div className='thread-comments'>
                    {commentsStatus === 'complete' && comments.map(comment => <ThreadComment comment={comment} key={comment._id} />)}
                </div>
                {threadsStatus === 'complete' && totalAmountOfPages > 1 && <div className='thread-pages'>
                    Go to page...
                    {pageNumbers && pageNumbers.map((num, idx) => <LinkText key={idx} onClick={() => changeCurrentPage(num)} selected={num === page}>{num}</LinkText>)}
                </div>
                }
                {(!thread.locked) && <CommentForm className='thread-comment-form' threadId={threadId} />}
            </Container>
        </div>
    );
}

export default styled(Thread)`
& .thread-comments > *:not(:first-child) {
    margin: 24px 0;
}
& .thread-comment-form {
    margin-top: 16px;
}
& .action-controls {
    margin-top: 8px;
    > *:first-child {
        margin-right: 4px;
    }
    > *:last-child {
        margin-left: 4px;
    }
}
.thread-pages > * {
    padding: 3px;
}
`;

