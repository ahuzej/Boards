import React, { useState, useContext } from 'react';
import FormInput from '../../_components/formInput/FormInput';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { AuthContext } from '../../context/authContext/AuthContext';
import AuthService from '../../_services/AuthService';
import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', 
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AuthContext);
    const history = useHistory();
    const classes = useStyles();

    const handleSubmit = (e) => {
        e.preventDefault();
        AuthService.loginUser(username, password).then((response) => {
            setUser(response);
            history.push('/home');
        });
    }

    return (
        <Container maxWidth='xs'>
            <div className={classes.paper}>
            <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">Login</Typography>
            <form className="registration-form" onSubmit={e => handleSubmit(e)}>
                <FormInput required margin='normal' fullWidth label='Username' type='text' value={username} onChange={e => setUsername(e.target.value)} />
                <FormInput required margin='normal' fullWidth label='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
                <Box mt={2}>
                    <Button margin='normal' fullWidth type='submit' variant="contained" color="primary">Submit</Button>
                </Box>
            </form>
            </div>
        </Container>

    );
}

export default Login;