import React from 'react';
import { Link } from 'react-router-dom';
import './navbarStyle.scss';

function Navbar() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to='/registration'>Register</Link>
                </li>
                <li>
                    <Link to='/login'>Login</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;