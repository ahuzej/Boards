import React, {  useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import Container from '../ui/Container';
import Title, { Subtitle } from '../ui/Title';
import ThreadComment from './ThreadComment';
import styled from 'styled-components';
import CommentForm from './CommentForm';
import useQuery from '../hooks/useQuery';
import LinkText from '../ui/LinkText';
import useArrayPaging from '../hooks/useArrayPaging';
import ProjectAPI from '../api/ProjectAPI';
import useRequest from '../hooks/useRequest';
import Moment from 'react-moment';
import { dateFormat } from '../ui/uiSettings';

function Thread(props) {
    const { className } = props;

    /**
     * Fetches information about the current thread by the thread id.
     */
    async function fetchThreadData() {
            const response = await ProjectAPI.getThread(user.token, threadId);
            console.log(response);
            setThread(response);
    }

    function changeCurrentPage(nextPage) {
        history.push({
            search: `?page=${nextPage}`
        });
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    async function handleCommentSubmit(values) {
        try {
            await ProjectAPI.createComment(user.token, thread._id, values);
            fetchThreadData();
        } catch {

        }
    }

    const { threadId } = useParams();
    const user = useSelector(state => state.auth);
    const query = useQuery();
    const [ threadsLoading, threadsError ] = useRequest(fetchThreadData, [threadId, user.token]);
    const history = useHistory();
    const [thread, setThread] = useState({});

    // Paging thread comments
    const page = query.get('page') ? +query.get('page') : 1;
    const [pagedComments, totalPageNumber] = useArrayPaging(thread.commentList, 5, page);
    const pageNumbers = [...Array(totalPageNumber + 1).keys()].slice(1);

    return (
        <div className={className}>
            <Container light>
                <Title>{thread.title}</Title>
                {thread.dateTime && <Subtitle light><Moment format={dateFormat}>{thread.dateTime}</Moment></Subtitle>}
            </Container>
            <Container>
                <div className='thread-comments'>
                    {(!threadsLoading && !threadsError) && pagedComments && pagedComments.map(comment => <ThreadComment comment={comment} key={comment._id} />)}
                </div>
                {(!threadsLoading && !threadsError) && totalPageNumber > 1 && <div className='thread-pages'>
                    Go to page...
                    {pageNumbers && pageNumbers.map((num,idx) => <LinkText key={idx} onClick={() => changeCurrentPage(num)} selected={num === page}>{num}</LinkText>)}
                </div>
                }
                {!thread.locked && <CommentForm submitCallback={handleCommentSubmit} /> }
            </Container>
        </div>
    );
}

export default styled(Thread)`
& .thread-comments > *:not(:first-child) {
    margin: 24px 0;
}

.thread-pages > * {
    padding: 3px;
}
`;

