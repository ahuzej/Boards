import 'date-fns';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import FormInput from '../../_components/formInput/FormInput';
import axios from 'axios';
import { useHistory } from 'react-router';

function NewProject() {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [startDate, setStartDate] = React.useState(new Date(Date.now()));
    const [endDate, setEndDate] = React.useState(new Date());
    const history = useHistory();

    const handleSubmit = (e) => {
      e.preventDefault();

      axios.put('http://localhost:3001/projects', {
        title, description, startDate, endDate
      }).then((response) => {
        if(response.status === 200) {
          console.log(response.data);
          history.push('/home');
        }
      }).catch((err) => console.log('Error while trying to create new project!'));
    }
    
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <form onSubmit={(e) => handleSubmit(e)}>
        <Container>
        <Typography style={{marginTop: '24px', marginBottom: '32px'}} variant='h4'>
            Create new project
        </Typography>
        <Box mb={2}>
        <Typography variant='h6'>
            Title:
        </Typography>            
        <FormInput fullWidth label='Name' onChange={(e) => {setTitle(e.target.value)}} value={title} />
        </Box>
        <Box mb={2}>
        <Typography variant='h6'>
            Description:
        </Typography>
        <FormInput fullWidth multiline rows='5' label='Description' onChange={(e) => {setDescription(e.target.value)}} value={description} />
        </Box>
        <Box>

        </Box>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          id="start-date"
          label="Start date"
          style={{marginRight: '16px'}}
          value={startDate}
          onChange={setStartDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          id="end-date"
          label="End date"
          value={endDate}
          onChange={setEndDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
                <Box mt={5}>
                    <Button margin='normal'  type='submit' variant="contained" color="primary">Create</Button>
                </Box>


        </Container>
        </form>
        </MuiPickersUtilsProvider>
    );
}
export default NewProject;