import React, { useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import styled from 'styled-components';
import NavigationContext from '../contexts/NavigationContext';
import { uploadAvatar } from '../slices/userSlice';
import { fetchUserById, usersByIdSelector, usersStatusSelector } from '../slices/usersSlice';
import DefaultButton from '../ui/DefaultButton';
import { StyledInput } from '../ui/FormikInput';
import ImageFrame from '../ui/ImageFrame';
import StatsLabel from '../ui/StatsLabel';
import { appName } from '../ui/uiSettings';

function ProfileHome(props) {
    const { className } = props;
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(state => usersByIdSelector(state, id));
    const usersStatus = useSelector(usersStatusSelector);
    const navContext = useContext(NavigationContext);
    const fileInputRef = useRef();

    const { username } = user || {};
    console.log(user);

    useEffect(() => {
        if (!user && usersStatus === 'idle') {
            dispatch(fetchUserById({ id }));
        }
    }, [dispatch, id, user, usersStatus]);

    /**
 * After every render, change the page title only if user name has changed. 
 */
    useEffect(() => {
        let title = username ?? 'Loading...';
        document.title = `${title} - ${appName}`;
        navContext.setTitle(title);

    }, [username, navContext]);

    function handleUploadAvatarButtonClick() {
        fileInputRef.current.click();
    }

    function handleInputFileChange(evt) {
        var fileList = evt.target.files;

        console.log(fileList);
        dispatch(uploadAvatar({ onOk: () => { console.log('ok') }, onError: () => { console.log('error') }, data: { avatarImg: evt.target.files[0] } }))
    }

    return (
        <div className={className}>
            <div className='top-section'>
                <div className='avatar-section'>
                    <ImageFrame size='200px' />
                    <input onChange={handleInputFileChange} className='hidden' type='file' ref={fileInputRef} accept=".gif,.jpg,.jpeg,.png" />
                    <DefaultButton className='avatar-upload-button' onClick={handleUploadAvatarButtonClick}>Change avatar</DefaultButton>
                </div>
                <div className='details-section'>
                    <StatsLabel label='Total posts:' value='6' />
                    <StatsLabel label='Total comments:' value='15' />
                    <StatsLabel label='Total upvotes:' value='27' />
                    <StatsLabel label='Total downvotes:' value='8' />
                </div>
            </div>
        </div>
    );
}

export default styled(ProfileHome)`
    & .hidden {
        display: none;
    }
    & .top-section {
        display: flex;
    }
    & .avatar-upload-button {
        width: 100%;
    }
    & .avatar-section {
        background-color: #ccc;
        border: 1px solid #fafafa;
    }
    & .details-section {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        > * {
            padding: 8px;
        }
    }
`;