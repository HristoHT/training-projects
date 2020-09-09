import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Alert from '@material-ui/lab/Alert';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ItemDialog from "../../Components/ProuctPanel/ItemDialog";
import FilterList from '../../Components/Catalog/FilterList';
import ItemList from '../../Components/Catalog/ItemList';

import { formatNumber } from "../../Utils/NumberFormat";
import { useSelector, useDispatch } from 'react-redux';
import { setProductsAction } from "../../Utils/store/actions";
import { useSnackbar } from 'notistack';

import api from '../../Utils/api';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 10,
    }, image: {
        width: 32 * 2.5,
        height: 32 * 2.5,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '80%',
        maxHeight: '80%',
    },
    table: {
        maxHeight: '75vh',
        overflowY: 'auto',
    }
}));

const Catalog = ({ goTo, ...props }) => {
    const classes = useStyles();

    return <div className={classes.root}>
        <Grid container spacing={3} >
            <Grid item xs={12} md={3} container>
                <FilterList />
            </Grid>
            <Grid item xs={12} md={9} container>
                <ItemList />
            </Grid>
        </Grid>
    </div>
}

export default Catalog;