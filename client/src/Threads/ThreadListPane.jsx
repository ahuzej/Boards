import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import useArrayPaging from '../hooks/useArrayPaging';
import useQuery from '../hooks/useQuery';
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

    const { className, threads } = props;
    let query = useQuery();
    let page = +query.get('page');
    const history = useHistory();
    if (!page) page = 1;
    const [pagedValues, totalPageNumber] = useArrayPaging(threads, 8, page);

    function changeCurrentPage(nextPage) {
        history.push({
            search: `?page=${nextPage}`
        });
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    return (
        <div className={className}>
                <div className='thread-list'>
                    {pagedValues && pagedValues.length === 0 && <span className='info-empty-board'>This board is empty!</span>}
                    {pagedValues ? pagedValues.map(thread => {
                        return (
                            <ThreadListElement
                                key={thread._id}
                                thread={thread}
                                owner={thread.owner}
                                sticky={thread.sticky}
                                locked={thread.locked}
                                loaded={true}
                            />
                        );
                    }) : <>
                            <ThreadListElement loaded={false} />
                            <ThreadListElement loaded={false} />
                            <ThreadListElement loaded={false} />
                            <ThreadListElement loaded={false} />
                            <ThreadListElement loaded={false} />
                        </>
                    }
                </div>
            <Divider />
            <div className='thread-navigation'>
                {page !== 1 && totalPageNumber > 1 && <LinkText onClick={(evt) => changeCurrentPage(page - 1)}>Previous page</LinkText>}
                {totalPageNumber > page && <LinkText onClick={(evt) => changeCurrentPage(page + 1)}>Next page</LinkText>}
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