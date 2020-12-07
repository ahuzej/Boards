import React from 'react';
import styled from 'styled-components';
import AvatarPane from '../ui/AvatarPane';
import Divider from '../ui/Divider';
import Moment from 'react-moment';
import 'moment-timezone';
import { dateFormat, fontSizeLg, fontSizeMd } from '../ui/uiSettings';
import { useDispatch, useSelector } from 'react-redux';
import { createRating, updateRating } from '../slices/commentsSlice';
import { getUserSelector } from '../slices/userSlice';
import { ReactComponent as UpArrow } from '../svgs/up-arrow.svg';
import { ReactComponent as DownArrow } from '../svgs/down-arrow.svg';

function ThreadComment(props) {
    const { comment, className } = props;
    const { author } = comment;
    const user = useSelector(getUserSelector);
    const dispatch = useDispatch();
    const rating = comment.rating || {};

    async function handleRating(rating) {
        if (rating !== comment.userRating) {
            if (comment.userRating) {
                dispatch(
                    updateRating({
                        data: { type: rating, rated: author._id, comment: comment._id, thread: comment.thread },
                        token: user.token
                    })
                );
            } else {
                dispatch(
                    createRating({
                        data: { type: rating, rated: author._id, comment: comment._id, thread: comment.thread },
                        token: user.token
                    })
                );
            }

        }
    }

    return (
        <div className={className}>
            <div>
                <AvatarPane author={author} />
                <Divider />
                <div className='avatar-arrows'>
                    <div className='avatar-arrow-section'>
                        <div className='arrow' onClick={() => handleRating('upvote')}>
                            <UpArrow fill={comment.userRating === 'upvote' ? 'green' : '#ccc'} alt='' />
                        </div>

                    </div>
                    {rating.total}
                    <div className='avatar-arrow-section' onClick={() => handleRating('downvote')}>
                        <div className='arrow'>
                            <DownArrow fill={comment.userRating === 'downvote' ? 'red' : '#ccc'} />
                        </div>
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
        font-size: ${fontSizeLg};
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
        align-items: center;
        margin-top: 24px;
        & .arrow {
            max-width: 35px;

            & > svg {
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