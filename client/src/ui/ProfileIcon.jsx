import React, { useEffect, useRef, useState } from 'react';
import ImageFrame from './ImageFrame';
import LinkText from './LinkText';
import { ReactComponent as UserImage } from '../svgs/user.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSelector, logoutAction } from '../slices/userSlice';

function ProfileIcon() {
    const [visible, setVisible] = useState(false);
    const contextMenuRef = useRef();
    const user = useSelector(getUserSelector);
    const dispatch = useDispatch();

    function onFrameClick() {
        setVisible(!visible);
    }

    function handleLogout() {
        dispatch(logoutAction());
      }

    useEffect(() => {
        let isMounted = true;
        let bubbleListener = document.addEventListener('mousedown', function (evt) {
            console.log(evt);
            if(!evt.composedPath().includes(contextMenuRef.current) && isMounted) {
                setVisible(false);
            }
        });
        
        return () => { 
            isMounted = false;
            document.removeEventListener('mousedown', bubbleListener); 
        }
    }, []);

    return (
        <div>
            <ImageFrame className='nav-context-toggler' onClick={onFrameClick} size='30px' bordered={true} component={<UserImage fill='#ccc' />} />
            {visible && <div ref={contextMenuRef} className='nav-dropdown'>
                <div className='nav-context-menu'>
                    <span className='dropdown-username'>{user.username}</span>
                    <LinkText onClick={handleLogout}>Log out</LinkText>
                </div>
            </div>
            }
        </div>
    );
}

export default ProfileIcon;