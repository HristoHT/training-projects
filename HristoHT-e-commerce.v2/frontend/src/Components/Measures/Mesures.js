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
import MeasuresDialog from "./MeasuresDialog";
import { formatNumber } from "../../Utils/NumberFormat";
import { useSelector, useDispatch } from 'react-redux';
import { setMeasuresActions } from "../../Utils/store/actions";
import { useSnackbar } from 'notistack';

import api from '../../Utils/api';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 10,
    }
}));

const Row = ({ row }) => {
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch();
    const setMeasures = measures => dispatch(setMeasuresActions(measures));
    const { enqueueSnackbar } = useSnackbar();

    const updateMeasure = () => {
        setOpen(true);
    }

    const deleteMeasure = (id) => (e) => {
        api.request('DELETE', 'measures', { param: `/${id}` })()
            .then(data => {
                enqueueSnackbar('Разфасовката е изтрита', { variant: "success" });
                setMeasures(data);
            })
            .catch(err => {
                enqueueSnackbar(err.message, { variant: "error" });
            });
    }

    return <TableRow key={row.id}>
        <TableCell component="th" scope="row">
            {row.name}
        </TableCell>
        <TableCell align="right">{formatNumber(row.quantity, 3)}</TableCell>
        <TableCell align="right">{formatNumber(row.price, 2)}</TableCell>
        <TableCell align="right">
            <ButtonGroup>
                <IconButton size="small">
                    <CreateIcon fontSize="small" onClick={updateMeasure} />
                </IconButton>
                <IconButton size="small">
                    <DeleteIcon fontSize="small" onClick={deleteMeasure(row.id)} />
                </IconButton>
            </ButtonGroup>
        </TableCell>
        <MeasuresDialog setOpen={setOpen} open={open} id={row.id} update />
    </TableRow>
}

const AddItem = ({ goTo, ...props }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const measures = useSelector(state => state.measures);
    const dispatch = useDispatch();
    const setMeasures = measures => dispatch(setMeasuresActions(measures));

    useEffect(() => {
        api.request('GET', 'measures')()
            .then(data => {
                setMeasures(data);
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
        <Grid xs={6} >
            <Grid item xs={12} container direction="column" spacing={2} component={Paper}>
                <Grid item >
                    <Grid item>
                        <Typography variant="h6" align="center">Разфасовки</Typography>
                    </Grid>
                    <TableContainer >
                        <Table className={classes.table} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Име</TableCell>
                                    <TableCell align="right">Количество</TableCell>
                                    <TableCell align="right">Ед. цена</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {measures.map((row) => <Row row={row} />)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} container justify="flex-end">
                    <Grid item >
                        <Button color="primary" variant="text" onClick={addMeasure}>Добави</Button>
                    </Grid>
                    <MeasuresDialog setOpen={setOpen} open={open} />
                </Grid>
            </Grid>
        </Grid>
    </div>
}

export default AddItem;