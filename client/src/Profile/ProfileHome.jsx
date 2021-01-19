import React, { useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import NavigationContext from "../contexts/NavigationContext";
import { getUserSelector, uploadAvatar } from "../slices/userSlice";
import {
  fetchUserById,
  usersByIdSelector,
  usersStatusSelector,
} from "../slices/usersSlice";
import DefaultButton from "../ui/DefaultButton";
import Divider from "../ui/Divider";
import { StyledInput } from "../ui/FormikInput";
import ImageFrame from "../ui/ImageFrame";
import StatsLabel from "../ui/StatsLabel";
import Title from "../ui/Title";
import { appName } from "../ui/uiSettings";

function ProfileHome(props) {
  const { className } = props;
  const { id } = useParams();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(getUserSelector);

  const user = useSelector((state) => usersByIdSelector(state, id));
  const usersStatus = useSelector(usersStatusSelector);
  const navContext = useContext(NavigationContext);
  const fileInputRef = useRef();

  const { username, avatarUrl } = user || {};
  useEffect(() => {
    if (!user && usersStatus !== "loading") {
      dispatch(fetchUserById({ id }));
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
          <StatsLabel label="Member since:" value="December 28 2020" />
          <StatsLabel label="Total posts:" value="6" />
          <StatsLabel label="Total comments:" value="15" />
          <StatsLabel label="Total upvotes:" value="27" />
          <StatsLabel label="Total downvotes:" value="8" />
        </div>
      </div>
      <Divider />

      <div className='flexed'>
        <div className='category-list'>
          <Title dark>Threads</Title>
          <Divider />
          <div>
            <div>
              <span>Blabla</span>
            </div>
          </div>
        </div>
        <div className='category-list'>
          <Title dark>Comments</Title>
          <Divider />
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
    
    &:first-child {
      margin-right: 12px;
    }
  }
  & .category-list {
    width: 100%;
    background-color: #fafafa;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
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
