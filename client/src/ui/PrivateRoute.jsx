import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';


function PrivateRoute(props) {
    const auth = useSelector(function (state) {
        return state.auth;
    });
    const { component, children } = props;
    if (auth.loggedIn) {
        return !children ? <Route {...props} component={component} /> : <Route {...props}>{children}</Route>
    } else {
        return <Redirect to='/login' />;
    }
}

export default PrivateRoute;