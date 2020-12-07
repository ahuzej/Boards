import React, { useEffect } from 'react';
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
import { threadByIdSelector, threadsStatusSelector } from '../slices/threadsSlice';
import { commentsPagingSelector, commentsStatusSelector, getAllComments } from '../slices/commentsSlice';
import usePaging from '../hooks/usePaging';

function Thread(props) {
    const { className } = props;
    const { threadId } = useParams();

    const itemsPerPage = 10;
    const [page, changeCurrentPage] = usePaging('page');
    const { items: comments, totalAmountOfPages } = useSelector(state => commentsPagingSelector(state, page, itemsPerPage));
    const dispatch = useDispatch();
    const thread = useSelector(state => threadByIdSelector(state, threadId)) || {};
    const threadsLoaded = useSelector(threadsStatusSelector) === 'complete';
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

    return (
        <div className={className}>
            <Container light>
                <Title>{thread.title}</Title>
                {thread.dateTime && <Subtitle light><Moment format={dateFormat}>{thread.dateTime}</Moment></Subtitle>}
            </Container>
            <Container>
                <div className='thread-comments'>
                    {commentsStatus === 'complete' && comments.map(comment => <ThreadComment comment={comment} key={comment._id} />)}
                </div>
                {(threadsLoaded) && totalAmountOfPages > 1 && <div className='thread-pages'>
                    Go to page...
                    {pageNumbers && pageNumbers.map((num, idx) => <LinkText key={idx} onClick={() => changeCurrentPage(num)} selected={num === page}>{num}</LinkText>)}
                </div>
                }
                {!thread.locked && <CommentForm className='thread-comment-form' threadId={threadId} />}
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

.thread-pages > * {
    padding: 3px;
}
`;

