import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ItemDialog from "../../Components/ProuctPanel/ItemDialog";
import GreenButton from "../Utils/GreenButton";
import { formatNumber } from "../../Utils/NumberFormat";
import { useSelector, useDispatch } from 'react-redux';
import { setProductsAction } from "../../Utils/store/actions";
import { useSnackbar } from 'notistack';
import AddIcon from '@material-ui/icons/Add';
import api from '../../Utils/api';
import Loader from "../Utils/Loader";

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

const Row = ({ row }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch();
    const setProducts = products => dispatch(setProductsAction(products));
    const { enqueueSnackbar } = useSnackbar();
    const user = useSelector(state => state.user);

    const addToCart = (product_id, measure_id) => (e) => {
        api.request('PUT', 'carts', {
            body: {
                user_id: user.id,
                product_id,
                measure_id,
                quantity: 1
            }
        })()
            .then(data => {
                enqueueSnackbar('Продуктът е добавена', { variant: "success" });
            })
            .catch(err => {
                enqueueSnackbar('Неуспешно добавяне на продукта', { variant: "error" });
            });
    }

    return <TableRow key={row.id}>
        <TableCell className={classes.image}>
            <img className={classes.img} src={row.image ? row.image : 'https://placehold.it/200x200'} />
        </TableCell>
        <TableCell component="th" scope="row">
            {row.name}
        </TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell >
            <Grid container justify="flex-end" spacing={2} alignItems="center">
                <Grid item>
                    <Typography align="left">
                        {row.measure_name}
                    </Typography>
                </Grid>
                <Grid item xs container direction="column" alignItems="center">
                    <Grid item xs>{formatNumber(row.price, 2)} лв.</Grid>
                    <Grid item xs>{formatNumber(row.quantity, 3)} бр.</Grid>
                </Grid>
            </Grid>
        </TableCell>
        <TableCell>
            <Grid container justify="flex-end" spacing={2} alignItems="center">
                <Grid item>
                    <GreenButton startIcon={<AddIcon />} onClick={addToCart(row.product_id, row.measure_id)}>
                        Добави
                    </GreenButton>
                </Grid>
            </Grid>
        </TableCell>
        {open && <ItemDialog setOpen={setOpen} open={open} id={row.id} update />}
    </TableRow>
}

const ItemList = ({ goTo, ...props }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const products = useSelector(state => state.products);
    const dispatch = useDispatch();
    const setProducts = products => dispatch(setProductsAction(products));
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true);
        api.request('GET', 'products', { queries: { visable: true } })()
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    return <Grid item xs={12} container justify="space-between">
        <Grid item xs={12}>
            <Typography variant="h6" align="center">Продукти</Typography>
        </Grid>
        <Grid item xs={12}>
            {!loading && <TableContainer className={classes.table}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Снимка</TableCell>
                            <TableCell>Име</TableCell>
                            <TableCell>Описание</TableCell>
                            <TableCell>
                                <Grid container justify="flex-end" spacing={2} alignItems="center">
                                    <Grid item >
                                        <Typography align="left">
                                            Разфасовка
                                        </Typography>
                                    </Grid>
                                    <Grid item xs container direction="column" alignItems="center">
                                        <Grid item>Количество</Grid>
                                        <Grid item>Цена</Grid>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((row) => <Row row={row} />)}
                    </TableBody>
                </Table>
            </TableContainer>}
            {loading && <Grid container justify="center">
                <Grid item xs container direction="column" alignItems="center">
                    <Grid item>
                        <Loader />
                    </Grid>
                </Grid>
            </Grid>}
        </Grid>
    </Grid>
}

export default ItemList;