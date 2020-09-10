import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green, purple, blue } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';

const GreenButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: green[700],
        '&:hover': {
            backgroundColor: green[500],
        },
    },
}))(Button);

export default GreenButton;