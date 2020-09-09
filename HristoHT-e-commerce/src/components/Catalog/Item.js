import React, { useState, useEffect } from "react";
import Rating from '@material-ui/lab/Rating';
import { formatNumber } from '../../utils/NumberFormat';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { Button } from "@material-ui/core";
import { green, purple, blue } from '@material-ui/core/colors';
import { useHistory } from "react-router-dom";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import api from "../../utils/api";
import { useSnackbar } from 'notistack';
import { useSelector } from "react-redux";

const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: green[700],
        borderRadius: 0,
        '&:hover': {
            backgroundColor: green[500],
        },
    },
}))(Button);

const BlueButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: blue[700],
        borderRadius: 0,
        '&:hover': {
            backgroundColor: blue[500],
        },
    },
}))(Button);

const useStyles = makeStyles((theme) => ({
    row: {
        borderBottom: '1px solid #d9d9d9'
    },
    image_container: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        display: 'flex'
    },
    img: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
}));
function Item({ row }) {
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const user = useSelector(state => state.user)

    const handleOpenOptions = (element) => (e) => {
        setOpen(true);
    }

    const openItem = (id) => (e) => {
        history.push({
            pathname: `/ItemInfo/${id}`,
            state: { id }
        })
    }

    const addToCart = (item_id) => (e) => {
        api.request('PUT', 'orders', {
            body: {
                user_id: user.id,
                item_id,
                item_quantity: 1
            }
        })()
            .then(res => {
                enqueueSnackbar(' Успешно добавено към количката', { variant: "success" });
            })
            .catch(err => {
                enqueueSnackbar(err.message, { variant: "error" });
                console.log(err);
            })
    }

    return (
        <Grid item xs={12} container className={classes.row} spacing={1} alignItems="center">
            <Grid item>
                <div className={classes.image_container}>
                    <img className={classes.img} alt="Няма интернет" src={row.img != 'null' ? row.img : 'https://placehold.it/60x60'} />
                </div>
            </Grid>
            <Grid item xs container>
                <Grid item xs={12}>
                    <Typography variant="h6">
                        {row.name}{' '}
                    <Typography variant="subtitle2" display="inline">{row.brand}</Typography>
                    </Typography>
                </Grid>
                <Grid item xs={12} container spacing={3} wrap="nowrap">
                    <Grid item>
                        <Typography variant="subtitle1">
                            {row.price}лв.
                            </Typography>
                    </Grid>
                    <Grid item xs zeroMinWidth style={{ maxWidth: 450 }}>
                        <Typography noWrap>
                            {row.description}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <BlueButton onClick={openItem(row.id)}> Информация </BlueButton>
            </Grid>
            <Grid item>
                <ColorButton onClick={addToCart(row.id)}> <ShoppingCartIcon /> </ColorButton>
            </Grid>
            <Grid item>
                <Grid container alignContent="center" direction="column" justify="space-around">
                    <Grid item>
                        <IconButton onClick={handleOpenOptions(row)} >
                            <SettingsIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton>
                            <EqualizerIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            {/* <AddItemDialog open={open} setOpen={setOpen} action='update' element={row} /> */}
        </Grid>
    );
}

export default Item;