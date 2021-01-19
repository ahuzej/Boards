import React, { useContext, useEffect, useRef } from "react";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";
import NavigationContext from "../contexts/NavigationContext";
import { getUserSelector, uploadAvatar } from "../slices/userSlice";
import {
    fetchProfileById,
    usersByIdSelector,
    usersStatusSelector,
} from "../slices/usersSlice";
import DefaultButton from "../ui/DefaultButton";
import Divider from "../ui/Divider";
import ImageFrame from "../ui/ImageFrame";
import LinkText from "../ui/LinkText";
import StatsLabel from "../ui/StatsLabel";
import Title from "../ui/Title";
import { appName, dateFormatSm } from "../ui/uiSettings";

function ProfileHome(props) {
    const { className } = props;
    const { id } = useParams();
    const dispatch = useDispatch();
    const loggedInUser = useSelector(getUserSelector);
    const history = useHistory();

    const user = useSelector((state) => usersByIdSelector(state, id));
    const usersStatus = useSelector(usersStatusSelector);
    const navContext = useContext(NavigationContext);
    const fileInputRef = useRef();

    const registrationDate = user?.registrationDate;
    const totalThreads = user?.totalThreads;
    const totalComments = user?.totalComments;
    const threads = user?.threads;
    const comments = user?.comments;

    const { username, avatarUrl } = user || {};
    useEffect(() => {
        if (!user && usersStatus !== "loading") {
            dispatch(fetchProfileById({ id }));
        }
    }, [dispatch, id, user, usersStatus]);

    /**
     * After every render, change the page title only if user name has changed.
     */
    useEffect(() => {
        let status;
        switch (usersStatus) {
            case "idle":
                status = "Loading...";
                break;
            case "failed":
            default:
                status = "Error!";
                break;
        }
        let title = username ?? status;
        document.title = `${title} - ${appName}`;
        navContext.setTitle(title);
    }, [username, navContext, usersStatus]);

    function handleUploadAvatarButtonClick() {
        fileInputRef.current.click();
    }

    function handleInputFileChange(evt) {
        var fileList = evt.target.files;

        console.log(fileList);
        dispatch(
            uploadAvatar({
                onOk: () => {
                    console.log("ok");
                },
                onError: () => {
                    console.log("error");
                },
                data: { avatarImg: evt.target.files[0] },
            })
        );
    }

    let input =
        loggedInUser.id === user?._id ? (
            <>
                <input
                    onChange={handleInputFileChange}
                    className="hidden"
                    type="file"
                    ref={fileInputRef}
                    accept=".jpg,.jpeg,.png"
                />
                <DefaultButton
                    className="avatar-upload-button"
                    onClick={handleUploadAvatarButtonClick}
                >
                    Change avatar
        </DefaultButton>
            </>
        ) : null;

    return usersStatus !== "failed" ? (
        <div className={className}>
            <div className="top-section">
                <div className="avatar-section">
                    <ImageFrame src={avatarUrl} width="200px" height="150px" />
                    {input}
                </div>
                <div className="details-section">
                    <StatsLabel label="Member since:" value={registrationDate ? <Moment format={dateFormatSm}>{registrationDate}</Moment> : null} />
                    <StatsLabel label="Total posts:" value={totalThreads} />
                    <StatsLabel label="Total comments:" value={totalComments} />
                </div>
            </div>
            <Divider />

            <div className='flexed'>
                <div className='category-list'>
                    <Title dark>Threads</Title>
                    <Divider />
                    {threads && threads.map(thread => <div>
                        <LinkText onClick={() => history.push(`/boards/${thread.board}/thread/${thread._id}`)}>{thread.title}</LinkText>
                    </div>
                    )}
                </div>
                <div className='category-list'>
                    <Title dark>Comments</Title>
                    <Divider />
                    {comments && comments.map(comment => <div>
                        <span>{comment.text}</span>
                    </div>
                    )}
                </div>
            </div>
        </div>
    ) : (
            <span>No such user exists!</span>
        );
}

export default styled(ProfileHome)`
  & .flexed {
    display: flex;
    justify-content: space-around;
    
    & :first-child {
      margin-right: 12px;
    }

    & :last-child {
        margin-right: 12px;
      }
  }
  & .category-list {
    width: 100%;
    background-color: #f3f3f3;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    min-height: 500px;
    height: auto !important;
    height: 500px;

  }
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
