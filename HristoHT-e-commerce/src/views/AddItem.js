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
import api from '../utils/api';
import pages from '../utils/pages';
import { SnackbarProvider, useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: '5vh',
        padding: 25,
    },
    container: {
        backgroundColor: 'red'
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

var defaultState = {
    name: '',
    price: '',
    img: '',
    brand: '',
    description: ''
};

const AddItem = ({ goTo, ...props }) => {
    const classes = useStyles();
    const [product, setProduct] = useState({ ...defaultState });
    const { enqueueSnackbar } = useSnackbar();

    const loadImage = (e) => {
        if (e.target.files && e.target.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                setProduct({ ...product, img: e.target.result });
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const fieldChange = (field) => (e) => {
        const value = e.target.value;
        setProduct({ ...product, [field]: value });
    }

    const handleAdd = () => {
        api.request('POST', 'items', { body: { ...product } })()
            .then(res => {
                enqueueSnackbar('Успешно добавено', { variant: "success" });
                setProduct({ ...defaultState });
            })
            .catch(err => {
                enqueueSnackbar(err.message, { variant: "error" });
            })
    }

    return <Grid container justify="center" className={classes.root} >
        <Grid item xs={6} container component={Paper} spacing={4}>
            <Grid item xs={12}>
                <Typography variant='h5' align="center">Добавяне на продукт</Typography>
            </Grid>
            <Grid item xs={12} container>
                <Grid container direction="row" justify="space-between" spacing={2} >
                    <Grid item className={classes.image} container alignItems="center" spacing={1}>
                        <Grid item >
                            <img className={classes.img} src={product.img ? product.img : 'https://placehold.it/200x200'} />
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
                            <InputLabel htmlFor="price">Цена *  </InputLabel>
                            <Input required value={product.price} onChange={fieldChange('price')} endAdornment={<InputAdornment position="end">лв.</InputAdornment>} />
                        </Grid>
                        <Grid item xs={6} component={FormControl}>
                            <TextField required label="Марка" onChange={fieldChange('brand')} value={product.brand} fullWidth />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container spacing={1} >
                        <Grid item xs={12}>
                            <Typography variant='h6'>Описание</Typography>
                        </Grid>
                        <Grid item xs component={TextareaAutosize} defaultValue={product.description} rowsMin={3} onChange={fieldChange('description')} />
                    </Grid>
                    <Grid item xs container justify="center">
                        <Button variant="outlined" color="primary" onClick={handleAdd}>Запази</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
}

export default AddItem;