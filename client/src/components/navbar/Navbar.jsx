import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './navbarStyle.scss';
import AuthService from '../../_services/AuthService';
import { AuthContext } from '../../context/authContext/AuthContext';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import NavItem from '../../_components/navItem/NavItem';

const useStyles = makeStyles((theme) => ({
    navMenu: {
        justifyContent: 'space-evenly'
    },
    headerText: {
        marginRight: theme.spacing(2)
    }
}));

function Navbar(props) {
    const { user, setUser } = useContext(AuthContext);
    const classes = useStyles();
    const logoutUser = function () {
        AuthService.logoutUser();
        setUser(null);
    }

    return (
        <AppBar className={classes.navMenu} position="static">
            <Toolbar>
                <Typography variant='h6' className={classes.headerText}>
                    Project Planner
                </Typography>
                    {user != null ?
                        <>
                            <NavItem label='Home' component={Link} to='/home'></NavItem>
                            <NavItem label='Log out' component={Link} onClick={() => logoutUser()} to='/login'></NavItem>
                        </>
                        :
                        <>
                                <NavItem label='Register' component={Link} to='/registration'></NavItem>
                                <NavItem label='Login' component={Link} to='/login'></NavItem>                            
                        </>
                    }

            </Toolbar>
        </AppBar>
    );
}

export default Navbar;