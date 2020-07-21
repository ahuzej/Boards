import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../context/authContext/AuthContext';

function PrivateRoute({component: Component, ...rest}) {
    const { user } = useContext(AuthContext);

    return <Route {...rest} render={props => {

        if(!user) {
            return <Redirect to={{pathname: '/login', state: { from: props.location}}} />
        }
        return <Component {...props} />
    }} />
}

export default PrivateRoute;