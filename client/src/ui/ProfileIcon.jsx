import React, { useEffect, useRef, useState } from "react";
import ImageFrame from "./ImageFrame";
import LinkText from "./LinkText";
import { ReactComponent as UserImage } from "../svgs/user.svg";
import { useDispatch, useSelector } from "react-redux";
import { getUserSelector, logoutAction } from "../slices/userSlice";
import { useHistory } from "react-router";

function ProfileIcon() {
  const [visible, setVisible] = useState(false);
  const contextMenuRef = useRef();
  const user = useSelector(getUserSelector);
  const dispatch = useDispatch();
  const avatarUrl = user?.avatarUrl;
  const history = useHistory();

  function onFrameClick() {
    setVisible(!visible);
  }

  function handleLogout() {
    setVisible(!visible);
    dispatch(logoutAction());
  }

  function handleProfileClick() {
    setVisible(!visible);
    history.push(`/profile/${user.id}`);
  }

  useEffect(() => {
    let isMounted = true;
    let bubbleListener = document.addEventListener("mousedown", function (evt) {
      if (!evt.composedPath().includes(contextMenuRef.current) && isMounted) {
        setVisible(false);
      }
    });

    return () => {
      isMounted = false;
      document.removeEventListener("mousedown", bubbleListener);
    };
  }, []);

  return (
    <div>
      <ImageFrame
        className="nav-context-toggler"
        onClick={onFrameClick}
        width='30px'
        height='24px'
        padding='0px'
        bordered={true}
        component={
          avatarUrl ? <img src={avatarUrl} alt="" /> : <UserImage fill="#ccc" />
        }
      />
      {visible && (
        <div ref={contextMenuRef} className="nav-dropdown">
          <div className="nav-context-menu">
            <span className="dropdown-username">{user.username}</span>
            <LinkText onClick={handleProfileClick}>Profile</LinkText>
            <LinkText onClick={handleLogout}>Log out</LinkText>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileIcon;
