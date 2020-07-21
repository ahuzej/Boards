import React, { useState } from 'react';
import FormInput from '../../_components/formInput/FormInput';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { palette } from '@material-ui/system';

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

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const classes = useStyles();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('http://localhost:3001/users', {
            username, password, firstName, lastName
        }).then((data) => console.log(data));
    }

    return (
        <Container maxWidth='xs'>
            <CssBaseline />
            <Box className={classes.paper} paddingBottom={5} border={1} borderLeft={0} borderRight={0} padding={2} borderColor="text.disabled">
            <Avatar className={classes.avatar}>
          <AccountBoxIcon />
        </Avatar>
        <Typography variant="h5">Registration</Typography>

            <form className="registration-form" onSubmit={e => handleSubmit(e)}>
                <FormInput required margin='normal' fullWidth label='Name' type='text' value={firstName} onChange={e => setFirstName(e.target.value)} />
                <FormInput required margin='normal' fullWidth label='Surname' type='text' value={lastName} onChange={e => setLastName(e.target.value)} />
                <FormInput required margin='normal' fullWidth label='Username' type='text' value={username} onChange={e => setUsername(e.target.value)} />
                <FormInput required margin='normal' fullWidth label='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
                <FormInput required margin='normal' fullWidth label='Confirm password' type='password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <Box mt={2}>
                    <Button fullWidth variant='contained' color='primary' type='submit'>Submit</Button>
                </Box>
            </form>

            </Box>

        </Container>
    );

}

export default Registration;