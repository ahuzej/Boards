import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import FancyTag from '../ui/FancyTag';
import ImageFrame from '../ui/ImageFrame';
import Moment from 'react-moment';
import 'moment-timezone';
import { dateFormat, fontSizeLg, fontSizeMd, fontSizeSm } from '../ui/uiSettings';
import moment from 'moment';

function ThreadListElement(props) {
    const { className } = props;
    const { loaded, thread, lastComment } = props;
    
    const { _id: id, title, sticky, locked, comments, owner } = thread || {};
    const { username, img } = owner || {};

    const { dateTime, author } = lastComment || {};
    const history = useHistory();
    const { location } = history;
    const [lastCommentTime, setLastCommentTime] = useState(moment(dateTime).fromNow());

    useEffect(() => {
        if (dateTime) {
            const interval = setInterval(() => {
                setLastCommentTime(moment(dateTime).fromNow());
            }, 1000);

            return () => clearInterval(interval);
        }
    }, []);

    return (
        <div className={className} onClick={() => history.push(`${location.pathname}/${id}`)}>
            <div className='thread-list-el-left'>
                <div>
                    <h5 className='thread-title'>
                        {sticky && <FancyTag color='sticky'>Sticky</FancyTag>}
                        {locked && <FancyTag color='locked'>Locked</FancyTag>}
                        {loaded ? title : <Skeleton />}
                    </h5>
                    <div className='thread-owner'>
                        <ImageFrame bordered={true} size='30px' src={img ? img : process.env.PUBLIC_URL + '/images/user.svg'} />
                        <span>{loaded ? username : <Skeleton width='100px' />}</span>
                    </div>
                </div>
                <div className='thread-flexed'>
                    <span className='thread-element'>{loaded ? `${comments} comments` : <Skeleton width='110px' />}</span>
                    <span className='thread-element'>{loaded ? (dateTime ? <Moment format={dateFormat}>{dateTime}</Moment> : null) : <Skeleton width='100px' />}</span>
                </div>
            </div>
            <div className='thread-list-el-right'>
                <div className='thread-last-post'>
                    <span>Latest post:</span>
                    <div className='thread-last-post-author'>
                        <ImageFrame size='30px' src={img ? img : process.env.PUBLIC_URL + '/images/user.svg'} />
                        <span>{author && author.username}</span>
                    </div>
                    <span>{lastCommentTime}</span>
                </div>
            </div>
        </div>
    );
}

export default styled(ThreadListElement)`
    display: flex;
    justify-content: space-between;
    border-left: 2px solid ${props => props.theme.lightBg};
    background-color: ${props => props.sticky ? '#cadefd' : '#f5f5f5'};
    & span {
        font-size: ${fontSizeMd};
    }
    & h5 {
        font-size: ${fontSizeMd};
    }
    & .thread-list-el-left:hover {
        transition: background-color 0.2s ease;
        background-color: #2c57af1f;
        cursor: pointer;
    }
    & > * {
        padding: 8px;
        margin-bottom: 1px;
    }
    & .thread-list-el-left {
        flex-grow: 2;
        padding-right: 8px;
    }
    & .thread-title {
        margin:0;
        padding:0;
        font-weight: 400;
        font-size: ${fontSizeLg};
        color: ${props => props.sticky ? '#374fab' : props.theme.linkTextColor};
        margin-bottom: 5px;
        > * {
            margin-right: 3px;
        }
    }
    & .thread-list-el-right {
        width: 120px;
        background-color: #f5f8fb;
        > * {
            font-size: ${fontSizeSm};
            color: #525252;
        }
    }
    & .thread-last-post-author {
        display: flex;
        align-items: center;
    }
    & .thread-owner {
        margin:0;
        padding:0;
        font-size: .9rem;
        color: #6b6b6b;
        display: flex;
        align-items: center;
        > * {
            :first-child {
                margin-right: 5px;
            }
        }
    }
    & .thread-element {
        font-size: ${fontSizeMd};
    }
    & .thread-flexed {
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        color: #525252;
    }
`;