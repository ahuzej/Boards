import styled from "styled-components";
import React from "react";
import { fontSizeLg } from "./uiSettings";
import { ReactComponent as UserImage } from "../svgs/user.svg";
import ImageFrame from "../ui/ImageFrame";
import { useHistory } from "react-router";
import { screenWidthMd } from './uiSettings';

function AvatarPane(props) {
  const { className } = props;
  const author = props.author ?? {};
  const avatarUrl = author?.avatarUrl;
  const history = useHistory();

  function redirectToProfile() {
    history.push(`/profile/${author._id}`);
  }

  return (
    <div onClick={redirectToProfile} className={className}>
      <div className="avatar-image">
        <ImageFrame
          fill="#ccc"
          size="100%"
          bordered={true}
          component={
            !avatarUrl ? (
              <UserImage fill="#ccc" />
            ) : (
              <img alt="" src={avatarUrl} />
            )
          }
        />
      </div>
      <div className="avatar-details">
        <span className="avatar-username">{author.username}</span>
      </div>
    </div>
  );
}

export default styled(AvatarPane)`
  display: block;
  width: 150px;
  padding: 8px;
  cursor: pointer;
  margin: ${(props) => (props.centered ? "0 auto" : "default")};
  color: ${(props) => props.theme.blackTextColor};
  & .avatar-image {
    width: 100px;
    height: 75px;
    border: 1px solid #ccc;
    margin: 8px auto;
    position: relative;
    > * {
      position: absolute;
      transform: translate(50%, -50%);
      top: 50%;
      right: 50%;
    }
  }

  & .avatar-details {
    width: 100%;
    text-align: center;

    & .avatar-username {
      padding-bottom: 8px;
      font-size: ${fontSizeLg};
    }
  }
  @media (max-width: ${screenWidthMd}) {
    width: 100%;
  }
`;
