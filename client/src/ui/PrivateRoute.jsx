import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { getUserSelector } from '../slices/userSlice';


function PrivateRoute(props) {
    const user = useSelector(getUserSelector);
    const { children } = props;
    if (user.loggedIn) {
        return <Route {...props}>{children}</Route>
    } else {
        return <Redirect to='/login' />;
    }
}

export default PrivateRoute;