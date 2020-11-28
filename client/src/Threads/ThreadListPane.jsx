import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import useArrayPaging from '../hooks/useArrayPaging';
import useQuery from '../hooks/useQuery';
import { getThreadsByBoardIdSelector } from '../slices/threadsSlice';
import Divider from '../ui/Divider';
import LinkText from '../ui/LinkText';
import ThreadListElement from './ThreadListElement';

/*
    Thread object:
    {
        title : String,
        comments : Number,
        commentList: [{
            author: {},
            text: String
            upVotes: Number,
            downVotes: Number
        }],
    }
*/

function ThreadListPane(props) {

    const { className, boardId } = props;
    let query = useQuery();
    let page = +query.get('page');
    const history = useHistory();
    if (!page) page = 1;
    const threads = useSelector(state => getThreadsByBoardIdSelector(state, boardId));
    console.log('SHHDHAH')
    console.log(threads);
    //const [pagedValues, totalPageNumber] = useArrayPaging(threads, 8, page);

    function changeCurrentPage(nextPage) {
        history.push({
            search: `?page=${nextPage}`
        });
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    return (
        <div className={className}>
                <div className='thread-list'>
                    {threads && threads.length === 0 && <span className='info-empty-board'>This board is empty!</span>}
                    {threads ? threads.map(thread => {
                        return (
                            <ThreadListElement
                                key={thread._id}
                                thread={thread}
                                lastComment={thread.lastComment}
                                sticky={thread.sticky}
                                locked={thread.locked}
                                loaded={true}
                            />
                        );
                    }) : <>
                            <ThreadListElement owner={{}} thread={{}} loaded={false} />
                            <ThreadListElement owner={{}} thread={{}} loaded={false} />
                            <ThreadListElement owner={{}} thread={{}} loaded={false} />
                            <ThreadListElement owner={{}} thread={{}} loaded={false} />
                            <ThreadListElement owner={{}} thread={{}} loaded={false} />
                        </>
                    }
                </div>
            <Divider />
            <div className='thread-navigation'>
            </div>
        </div>
    );
}

export default styled(ThreadListPane)`
    & .thread-navigation > *:first-child {
        margin-right: 16px;
    }
    & .info-empty-board {
        text-align: center;
        color: #656565cc;
    }
`;