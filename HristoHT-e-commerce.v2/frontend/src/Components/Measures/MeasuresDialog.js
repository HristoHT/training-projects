import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { useSnackbar } from 'notistack';
import { useDispatch } from "react-redux";
import { setMeasuresActions } from "../../Utils/store/actions";

import api from '../../Utils/api';

const defaultMeasureState = {
    name: '',
    price: '',
    quantity: ''
}

export default function MeasureDialog({ open, setOpen, id, update }) {
    const [measure, setMeasure] = useState({ ...defaultMeasureState });
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const setMeasures = measures => dispatch(setMeasuresActions(measures));

    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = () => {
        if (!update) {
            api.request('POST', 'measures', { body: { ...measure } })()
                .then(data => {
                    enqueueSnackbar('Разфасовката е добавена', { variant: "success" });
                    setMeasures(data);
                    handleClose();
                })
                .catch(err => {
                    enqueueSnackbar(err.message, { variant: "error" });
                });
        } else {
            api.request('PUT', 'measures', { body: { ...measure }, param: `/${id}` })()
                .then(data => {
                    enqueueSnackbar('Разфасовката е променена', { variant: "success" });
                    setMeasures(data);
                    handleClose();
                })
                .catch(err => {
                    enqueueSnackbar(err.message, { variant: "error" });
                });
        }
    }

    const changeField = (field) => (e) => {
        setMeasure({ ...measure, [field]: e.target.value.trim() });
    }

    useEffect(() => {
        if (!update) {
            setMeasure({ ...defaultMeasureState });
        } else {
            api.request('GET', 'measures', { param: `/${id}` })()
                .then(data => {
                    setMeasure({ ...data[0] });
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [id]);

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle></DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Grid container spacing={1}>
                        <Grid item md={4} xs={12}>
                            <TextField fullWidth label="Име" onChange={changeField('name')} defaultValue={measure.name} />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <TextField fullWidth label="Количество" onChange={changeField('quantity')} defaultValue={measure.quantity} />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <TextField fullWidth label="Ед. цена" onChange={changeField('price')} defaultValue={measure.price} />
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
    );
}