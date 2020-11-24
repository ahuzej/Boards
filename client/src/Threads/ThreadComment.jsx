import React from 'react';
import styled from 'styled-components';
import AvatarPane from '../ui/AvatarPane';
import Divider from '../ui/Divider';
import Moment from 'react-moment';
import 'moment-timezone';
import { dateFormat } from '../ui/uiSettings';

function ThreadComment(props) {
    const { comment, className } = props;
    const { author } = comment;

    return (
        <div className={className}>
            <div>
                <AvatarPane author={author} />
                <Divider />
                <div className='avatar-arrows'>
                    <div className='avatar-arrow-section'>
                        <div className='arrow'>
                            <img src={process.env.PUBLIC_URL + '/images/up-arrow.svg'} alt='' />
                        </div>
                        {comment.upVotes}
                    </div>
                    <div className='avatar-arrow-section'>
                        <div className='arrow'>
                            <img src={process.env.PUBLIC_URL + '/images/down-arrow.svg'} alt='' />
                        </div>
                        {comment.downVotes}
                    </div>
                </div>
            </div>
            <Divider vertical />
            <div className='thread-text'>
                {comment.text}
                <div className='thread-info-bar'>
                    <Moment format={dateFormat}>{comment.dateTime}</Moment>
                </div>
            </div>
        </div>
    );
}

export default styled(ThreadComment)`
    display: flex;
    border: 1px solid #ccc;
    height: 250px;
    width: 100%;
    & .thread-text {
        width: 100%;
        position: relative;
        padding: 8px;
    }
    & .thread-info-bar {
        padding: 8px;
        position: absolute;
        bottom:0;
        right: 0;
    }
    & > *:last-child {
        padding-bottom: 8px;
    }

    & .avatar-arrows {
        display: flex;
        justify-content: space-around;
        margin-top: 24px;
        & .arrow {
            max-width: 35px;

            & > img {
                width: 100%;
                height: 100%;
            }
        }
        & .avatar-arrow-section {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            text-align: center;
            cursor: pointer;

        }
    }
`;