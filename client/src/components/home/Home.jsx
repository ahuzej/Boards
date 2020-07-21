import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';

import ListItemText from '@material-ui/core/ListItemText';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/projects').then(
            (response) => {
                setProjects(response.data);
                setLoading(false);
            }

        );
    });

        return (
            <Grid container>
                <Grid item lg={2} xs={6}>
                    <Typography variant='h4'>My projects</Typography>
                    <List>
                        {loading ? <CircularProgress /> : projects.map((project) => {
                            return (
                            <ListItem button>
                                <ListItemText primary={project.title} />
                            </ListItem> );
                        })}
                    </List>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant='h4'>Home</Typography>
                </Grid>
            </Grid>
        );
    }

export default Home;