import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Title from './Title';
import { fontSizeMd } from './uiSettings';
import NavigationContext from '../contexts/NavigationContext';
import ProfileIcon from './ProfileIcon';

function Navbar(props) {
    const { className } = props;
    const navigation = useContext(NavigationContext);

    return (
        <div className={className}>
            <Title color='#fff' className='nav-title'>{navigation.title}</Title>
            <div className='flexed'>
                <Link className='nav-item' to='/boards'>Boards</Link>
                <div className='relative-container'>
                    <ProfileIcon />
                </div>
            </div>
        </div>
    );
}

export default styled(Navbar)`
    display: flex;
    background-color: ${props => props.theme.lightBg};
    justify-content: space-between;
    align-items: center;
    & .flexed {
        display: flex;
        align-items: center;
        > *:last-child {
            margin-left: 16px;
        }
    }
    & > * {
        margin:0 8px;
        padding: 8px;
        
    }
    & > *:first-child {
        font-weight: 200;
    }
    & .nav-item {
        text-decoration: none;
        color: ${props => props.theme.navTextColor};
        cursor: pointer;
        font-size: ${fontSizeMd};
    }
    & > *:not(:first-child):not(:last-child) {
        margin:0 8px;
        padding: 16px;
    }
    & > .logout-section {
        width: 100%;
        text-align: right;
    }
    & .relative-container {
        position: relative;
    }
    .nav-context-toggler {
        cursor: pointer;
    }
    & .nav-dropdown {
        position: absolute;
        border: 1px solid #ccc;
        font-size: ${fontSizeMd};
        width: 150px;
        right: 0px;
        background-color: #fffefe;
        .dropdown-username {
            color: ${props => props.theme.lightBg};
            font-weight: bold;
        }
    }
    & .nav-context-menu {
        > * {
            display: block;
            padding: 8px;
        }
    }
`