import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import AccountCircle from '@material-ui/icons/AccountCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Alert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";

import api from '../utils/api';
import pages from '../utils/pages';

import PurchaseInfo from '../components/Purchases/PurchesInfo';
import FilterList from '../components/Purchases/FilterList';
import { queries } from '@testing-library/react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { toNumber, formatNumber } from "../utils/NumberFormat";
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: 25,
    },
    container: {
        backgroundColor: 'red'
    }
}));

const Row = ({ row, i }) => {
    const [open, setOpen] = useState(false)

    const openInfo = (row) => (e) => {
        setOpen(true);
    }

    return <TableRow key={i}>
        <TableCell align="right">{row.order_id}</TableCell>
        <TableCell component="th" scope="row">
            {row.username}
        </TableCell>
        <TableCell>{(new Date(Number(row.order_modified))).toLocaleString()}</TableCell>
        <TableCell>{row.order_status === 'not finished' ?
            <Typography color="secondary">Незавършена</Typography> :
            <Typography color="primary">Завършена</Typography>}</TableCell>
        <TableCell align="right">{formatNumber(row.order_price, 2)}лв.</TableCell>
        <TableCell align="right">
            <IconButton size="small" onClick={openInfo(row)}>
                <InfoIcon />
            </IconButton>
        </TableCell>
        <PurchaseInfo row={row} open={open} setOpen={setOpen} />
    </TableRow>
}

const Purchases = ({ goTo, ...props }) => {
    const classes = useStyles();
    const [response, setResponse] = useState({ loading: true, data: {} })

    const request = (queries = {}) => {
        api.request('GET', 'orders', { queries })()
            .then(res => {
                setResponse({ loading: false, data: res });
            });
    }

    return <div className={classes.root}>
        <Grid container spacing={3} >
            <Grid item xs={12} md={3} container>
                <FilterList options={response.data.options || {}} maxPrice={response.data.maxPrice || 100} request={request} />
            </Grid>
            <Grid item xs container>
                <TableContainer>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">ID</TableCell>
                                <TableCell>Потребител</TableCell>
                                <TableCell>Дата</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell align="right">Цена</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className={classes.itemList}>
                            {response.data.rows && response.data.rows.map((row, i) => (<Row i={i} row={row} />))}
                        </TableBody>
                    </Table>
                    {response.data.rows && !response.data.rows.length && <Typography align="center">
                        Няма поръчки
                        </Typography>}
                </TableContainer>
            </Grid>
        </Grid>
    </div>
}

export default Purchases;