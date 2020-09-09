import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { green, purple, blue } from '@material-ui/core/colors';

import api from '../utils/api';
import pages from '../utils/pages';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { toNumber, formatNumber } from "../utils/NumberFormat";
import { useSnackbar } from 'notistack';
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: '5vh',
        padding: 25,
    },
    itemList: {
        maxHeight: '40vh',
        // height: '40vh',
        // backgroundColor: 'red'
    }, image: {
        width: 32 * 6.5,
        height: 32 * 6.5,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '80%',
        maxHeight: '80%',
    },
    input: {
        display: 'none'
    },
}));

const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: green[700],
        '&:hover': {
            backgroundColor: green[500],
        },
    },
}))(Button);

const Cart = ({ goTo, ...props }) => {
    const classes = useStyles();
    const [response, setResponse] = useState({ loading: true, data: {} })
    const [total, setTotal] = useState(0);
    const { enqueueSnackbar } = useSnackbar();
    const user = useSelector(state => state.user)

    useEffect(() => {
        setResponse({ loading: true, data: {} });
        api.request('GET', 'orders', { queries: { user_id: user.id, type: 'not finished' } })()
            .then(res => {
                let newTotal = 0;
                console.log(res);
                res.rows = res.rows.reduce((arr, cur) => {
                    const index = arr.findIndex((obj) => cur.item_id === obj.item_id);
                    newTotal = toNumber(cur.order_price);
                    if (index === -1) {
                        arr.push(cur);
                    } else {
                        arr[index].item_quantity = toNumber(arr[index].item_quantity) + toNumber(cur.item_quantity);
                    }

                    return arr;
                }, []);

                setTotal(newTotal)
                setResponse({ loading: false, data: res });
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const handlePayment = (e) => {
        api.request('PUT', 'orders', { param: `/${user.id}` })()
            .then(res => {
                console.log(res);
                setTotal(0)
                setResponse({ loading: false, data: res });
                enqueueSnackbar('Плащането е успешно', { variant: "success" });
            })
            .catch(err => {
                console.log(err);
                enqueueSnackbar('Възникна грешка при плащането', { variant: "error" });
            });
    }

    const handleCancel = (e) => {
        api.request('DELETE', 'orders', { param: `/${user.id}` })()
        .then(res => {
            setTotal(0)
            setResponse({ loading: false, data: res });
            enqueueSnackbar('Количката изчистена', { variant: "info" });
        })
        .catch(err => {
            console.log(err);
            enqueueSnackbar('Възникна грешка при плащането', { variant: "error" });
        });
    }

    return <Grid container justify="center" className={classes.root} >
        <Grid item xs={6} container component={Paper} spacing={2}>
            <Grid item xs={12}>
                <Typography variant='h5' align="center">Количка</Typography>
            </Grid>
            <Grid item xs={12} container>
                <Grid item xs={12}>
                    <Typography variant='h6'>Продукти</Typography>
                </Grid>
                <Grid item xs={12} container >
                    <TableContainer>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Продукт</TableCell>
                                    <TableCell align="right">Ед. Цена</TableCell>
                                    <TableCell align="right">Количество</TableCell>
                                    <TableCell align="right">Стойност</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className={classes.itemList}>
                                {response.data.rows && response.data.rows.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell component="th" scope="row">
                                            {row.item_name}
                                        </TableCell>
                                        <TableCell align="right">{formatNumber(row.item_price, 2)}</TableCell>
                                        <TableCell align="right">{formatNumber(row.item_quantity, 3)}</TableCell>
                                        <TableCell align="right">{formatNumber(toNumber(row.item_quantity) * toNumber(row.item_price), 2)}лв.</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {response.data.rows && !response.data.rows.length && <Typography align="center">
                            Няма продукти
                        </Typography>}
                    </TableContainer>
                </Grid>
            </Grid>

            <Grid item xs container justify="flex-end">
                <Grid item xs={12} md={4} container justify="space-between">
                    <Grid item>
                        <Typography variant="h6">Общо:</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">{formatNumber(total, 2)}лв.</Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} container justify="center" spacing={2}>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={handleCancel}>Откажи</Button>
                </Grid>
                <Grid item>
                    <ColorButton variant="outlined" color="primary" onClick={handlePayment}>Плати</ColorButton>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
}

export default Cart;