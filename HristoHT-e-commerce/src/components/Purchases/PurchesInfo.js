import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { toNumber, formatNumber } from "../../utils/NumberFormat";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import api from '../../utils/api';
import Typography from '@material-ui/core/Typography';

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
export default function PurchaseInfo({ open, setOpen, row }) {
    const classes = useStyles();
    const [response, setResponse] = useState({ loading: true, data: {} })

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setResponse({ loading: true, data: {} });
        api.request('GET', 'orders', { queries: { order_id: row.order_id } })()
            .then(res => {
                console.log(res);
                res.rows = res.rows.reduce((arr, cur) => {
                    const index = arr.findIndex((obj) => cur.item_id === obj.item_id);

                    if (index === -1) {
                        arr.push(cur);
                    } else {
                        arr[index].item_quantity = toNumber(arr[index].item_quantity) + toNumber(cur.item_quantity);
                    }

                    return arr;
                }, []);

                setResponse({ loading: false, data: res });
            })
            .catch(err => {
                console.log(err);
            })
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>Поръчка № {row.order_id} от "{row.username}" на стойност {formatNumber(row.order_price, 2)}лв.</DialogTitle>
            <DialogContent>
                <DialogContentText >
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
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Затвори
                </Button>
            </DialogActions>
        </Dialog>
    );
}