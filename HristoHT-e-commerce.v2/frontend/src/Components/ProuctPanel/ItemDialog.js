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
import { useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import api from '../../Utils/api';
import pages from '../../Utils/pages';
import { useSnackbar } from 'notistack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MeasuresSelect from "./MeasuresSelect";

import { useDispatch, useSelector } from "react-redux";
import { setProductAction, setProductFieldAction, setProductsAction } from "../../Utils/store/actions";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: '5vh',
        padding: 25,
    },
    container: {
        backgroundColor: 'red'
    }, image: {
        width: 32 * 5,
        height: 32 * 5,
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

var defaultState = {
    name: '',
    image: '',
    measures: [],
    description: '',
    tags: [1]
};

const ItemDialog = ({ open, setOpen, id, update }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const setProduct = product => dispatch(setProductAction(product));
    const setProductField = (field, value) => dispatch(setProductFieldAction({ field, value }));
    const setProducts = (products) => dispatch(setProductsAction(products));
    const product = useSelector(state => state.product);

    const loadImage = (e) => {
        if (e.target.files && e.target.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                setProductField('image', e.target.result);
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const fieldChange = (field) => (e) => {
        const value = e.target.value;
        setProductField(field, value);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = () => {
        if (!update) {
            api.request('POST', 'products', { body: { ...product } })()
                .then(res => {
                    enqueueSnackbar('Успешно добавено', { variant: "success" });
                    setProduct({ ...defaultState });
                    setProducts(res);
                    handleClose();
                })
                .catch(err => {
                    enqueueSnackbar(err.message, { variant: "error" });
                });
        } else {
            api.request('PUT', 'products', { body: { ...product }, param: `/${id}` })()
                .then(res => {
                    enqueueSnackbar('Успешно променен', { variant: "success" });
                    setProduct({ ...defaultState });
                    setProducts(res);
                    handleClose();
                })
                .catch(err => {
                    enqueueSnackbar(err.message, { variant: "error" });
                });
        }
    }

    useEffect(() => {
        console.log('IN')
        if (!update) {
            console.log('IN1')
            setProduct({ ...defaultState });
        } else {
            console.log('IN2')
            api.request('GET', 'products', { param: `/${id}` })()
                .then(data => {
                    console.log(data);
                    setProduct({ ...data });
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [id]);

    return <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle>{update ? '' : 'Добавяне на продукт'}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                <Grid container justify="center" >
                    <Grid item xs={12} container>
                        <Grid container spacing={2} >
                            <Grid item className={classes.image} container alignItems="center" spacing={1}>
                                <Grid item >
                                    <img className={classes.img} src={product.image ? product.image : 'https://placehold.it/200x200'} />
                                </Grid>
                                <Grid item container justify="center">
                                    <Grid item>
                                        <input accept="image/*" className={classes.input} id="photo" type="file" onChange={loadImage} />
                                        <label htmlFor="photo">
                                            <Button component="span" endIcon={<PhotoCamera />} variant="outlined">
                                                Снимка
                                </Button>
                                        </label>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs container spacing={1} >
                                <Grid item xs={12}>
                                    <TextField required label="Наименование" value={product.name} onChange={fieldChange('name')} autoFocus fullWidth />
                                </Grid>
                                <Grid item xs={6} component={FormControl}>
                                    <TextField required label="Дистрибутор" onChange={fieldChange('brand')} value={product.brand} fullWidth />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container spacing={1} >
                                <Grid item xs={12}>
                                    <Typography variant='h6'>Разфасовки</Typography>
                                </Grid>
                                <Grid item xs >
                                    <MeasuresSelect />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container spacing={1} >
                                <Grid item xs={12}>
                                    <Typography variant='h6'>Описание</Typography>
                                </Grid>
                                <Grid item xs component={TextareaAutosize} defaultValue={product.description} rowsMin={3} onChange={fieldChange('description')} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="secondary">
                Затвори
        </Button>
            <Button onClick={handleAdd} color="primary" autoFocus>
                Запази
        </Button>
        </DialogActions>
    </Dialog>
}

export default ItemDialog;