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
import { formatNumber } from "../../Utils/NumberFormat";
import { useSelector, useDispatch } from 'react-redux';
import { setProductsAction, updateProductAction } from "../../Utils/store/actions";
import { useSnackbar } from 'notistack';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import api from '../../Utils/api';
import ConfirmationDialog from "../../Components/Utils/ConfirmationDialog";

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
    const updateProduct = product => dispatch(updateProductAction(product));
    const { enqueueSnackbar } = useSnackbar();
    const [visable, setVisable] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false)
    const openUpdateProduct = () => {
        setOpen(true);
    }

    const updateVisability = (id) => () => {
        api.request('PATCH', 'products', { param: `/${id}`, body: { visable: !visable } })()
            .then(data => {
                enqueueSnackbar(visable ? 'Продуктът е скрит от каталога' : 'Продуктът се въжда в каталога', { variant: "success" });
                // setProducts(data);
                console.log(data);
                updateProduct(data);
            })
            .catch(err => {
                enqueueSnackbar(err.message, { variant: "error" });
            });
    }

    useEffect(() => {
        setVisable(row.visable);
    }, [row]);

    const deleteMeasure = (id) => (e) => {
        api.request('DELETE', 'products', { param: `/${id}` })()
            .then(data => {
                enqueueSnackbar('Продуктът е изтрит', { variant: "success" });
                setProducts(data);
                console.log(data);
            })
            .catch(err => {
                enqueueSnackbar(err.message, { variant: "error" });
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
        <TableCell align="right">
            <ButtonGroup>
                <IconButton onClick={updateVisability(row.id)}>
                    {visable ? <Visibility /> : <VisibilityOff />}
                </IconButton>
                <IconButton size="small">
                    <CreateIcon fontSize="small" onClick={openUpdateProduct} />
                </IconButton>
                <IconButton size="small">
                    <DeleteIcon fontSize="small" onClick={() => setConfirmDelete(true)} />
                </IconButton>
            </ButtonGroup>
        </TableCell>
        {confirmDelete && <ConfirmationDialog setOpen={setConfirmDelete} open={confirmDelete} callback={deleteMeasure}/>}
        {open && <ItemDialog setOpen={setOpen} open={open} id={row.id} update />}
    </TableRow>
}

const ProductPanel = ({ goTo, ...props }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const products = useSelector(state => state.products);
    const dispatch = useDispatch();
    const setProducts = products => dispatch(setProductsAction(products));

    useEffect(() => {
        api.request('GET', 'products')()
            .then(data => {
                setProducts(data);
                console.log(data)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const addMeasure = () => {
        setOpen(true);
    }

    return <div className={classes.root}>
        <Grid xs={12} >
            <Grid item xs={12} container direction="column" spacing={2}>
                <Grid item xs={12} container justify="space-between">
                    <Grid item>
                        <Typography variant="h6" align="center">Продукти</Typography>
                    </Grid>
                    <Grid item >
                        <Button color="primary" variant="text" onClick={addMeasure}>Добави</Button>
                    </Grid>
                    {open && <ItemDialog setOpen={setOpen} open={open} update={false} />}
                </Grid>
                <Grid item >
                    <TableContainer className={classes.table}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Снимка</TableCell>
                                    <TableCell>Име</TableCell>
                                    <TableCell>Описание</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((row) => <Row row={row} />)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Grid>
    </div>
}

export default ProductPanel;