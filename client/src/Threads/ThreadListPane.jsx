import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getThreadsSelector, threadsStatusSelector } from '../slices/threadsSlice';
import Divider from '../ui/Divider';
import ModalBox from '../ui/ModalBox';
import ThreadListElement from './ThreadListElement';

function ThreadListPane(props) {

    const { className, boardId } = props;
    const threads = useSelector(getThreadsSelector);
    const threadsStatus = useSelector(state => threadsStatusSelector(state, boardId));

    return (
        <div className={className}>
            {threadsStatus === 'error' ? 
                <div className='thread-error'>
                    <ModalBox><span>An error has occured while loading threads. Please try again.</span></ModalBox>
                </div> :
                <div className='thread-list'>
                    {threadsStatus === 'complete' && threads.length === 0 && <span className='info-empty-board'>This board is empty!</span>}
                    {threads && threadsStatus === 'complete' ? threads.map(thread => {
                        return (
                            <ThreadListElement
                                key={thread._id}
                                thread={thread}
                                lastComment={thread.lastComment}
                                sticky={thread.sticky}
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

            }
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
    & .thread-error {
        display: flex;
        justify-content: center;
        color: #ea3f3f;
    }
`;