import React from 'react';
import Button from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/styles';

const styles = {
    root: {
        'textAlign': 'center',
        'minWidth': '110px',
        'padding': '0 16px',
        '& .MuiTab-wrapper': {

        }
    }
};

function NavItem(props) {
    const { classes } = props;
    return (
        <Button className={classes.root} {...props}></Button>       
    );
}

export default withStyles(styles)(NavItem);