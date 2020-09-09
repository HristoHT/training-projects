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
import { useHistory, useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import api from '../utils/api';
import pages from '../utils/pages';
import toDate from '../utils/DateFormat';

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
    statistic: {
        height: '40vh',
        backgroundColor: 'red'
    }
}));


const startDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime();
}

const endDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).getTime();
}

const defaultFilter = {
    dateFrom: startDate(new Date()),
    dateTo: endDate(new Date()),
}


const ItemInfo = ({ goTo, ...props }) => {
    const classes = useStyles();
    const location = useLocation();
    const [item, setItem] = useState({});
    const [dateFrom, setDateFrom] = useState(toDate(new Date(), 'yyyy-mm-dd'));
    const [dateTo, setDateTo] = useState(toDate(new Date(), 'yyyy-mm-dd'));
    const [filters, setFilters] = useState({ ...defaultFilter });
    const [itemInfo, setitemInfo] = useState([])
    const [quantity, setquantity] = useState(0)

    const changeField = (field) => (e) => {
        if (field === 'dateTo') {
            let values = e.target.value.split('-'),
                date = new Date(Number(values[0]), Number(values[1]) - 1, Number(values[2]), 23, 59, 59, 999);

            setFilters({ ...filters, [field]: date.getTime() });
        } else if (field === 'dateFrom') {
            let values = e.target.value.split('-'),
                date = new Date(Number(values[0]), Number(values[1]) - 1, Number(values[2]), 0, 0, 0, 0);

            setFilters({ ...filters, [field]: date.getTime() });
        } else {
            setFilters({ ...filters, [field]: e.target.value });
        }

    }

    useEffect(() => {
        if (location.state.id) {
            api.request('GET', 'items', { param: `/${location.state.id}` })()
                .then(res => {
                    setItem(res.item);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [location.state.id])

    useEffect(() => {
        if (item.id) {
            api.request('PUT', 'items', { queries: { ...filters, item_id: item.id } })()
                .then(res => {
                    console.log(res);
                    setquantity(res.data.length);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [item, filters])

    return <Grid container justify="center" className={classes.root} >
        <Grid item xs={12} md={8} container component={Paper} spacing={4}>
            <Grid item xs={12} container justify="space-between">
                <Grid item>
                    <Typography variant='h5'>Продукт: {item.name || ''}</Typography>
                </Grid>
                <Grid item>
                    <Typography variant='h5'>Марка: {item.brand || ''}</Typography>
                </Grid>
                <Grid item>
                    <Typography variant='h5'>Цена: {item.price || '0.00'}лв.</Typography>
                </Grid>
            </Grid>
            <Grid item xs={12} container>
                <Grid container direction="row" justify="space-between" spacing={2} alignItems="center" >
                    <Grid item className={classes.image} container alignItems="center" spacing={1}>
                        <Grid item >
                            <img className={classes.img} src={item.img != 'null' ? item.img : 'https://placehold.it/200x200'} />
                        </Grid>
                    </Grid>
                    <Grid item xs container spacing={1} >
                        <Grid item container justify="center">
                            <Typography variant="subtitle1">
                                {item.description}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} container justify="flex-start" alignItems="flex-end" spacing={3}>
                <Grid item>
                    <TextField
                        label="От"
                        type="date"
                        defaultValue={dateTo}
                        onChange={changeField('dateFrom')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="До"
                        type="date"
                        onChange={changeField('dateTo')}
                        defaultValue={dateFrom}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item>
                    <Typography>Брой продадени артикула: {quantity}</Typography>
                </Grid>
            </Grid>

        </Grid>
    </Grid>
}

export default ItemInfo;