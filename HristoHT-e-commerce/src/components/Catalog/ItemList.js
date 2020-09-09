import React, { useState, useEffect } from "react";
// import "../utils/css/Table.css";
import { makeStyles } from '@material-ui/core/styles';
import Item from './Item';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
    root: {
        overflowY: 'auto',
        maxHeight: '75vh',
        padding: 10
    },
    pagination:{
        paddingTop: 10
    }
}));


function ItemList({ data }) {
    const classes = useStyles();

    return (<div>
        <Grid container className={classes.root} component={Paper}>
            {(data || []).map((row, i) => <Item row={row} key={i}/>)}
        </Grid>
        {/* <Grid container justify="center" className={classes.pagination}>
            <Grid item xs={12} md={6}>
                <Pagination count={10} variant="outlined" shape="rounded" color="primary"/>
            </Grid>
        </Grid> */}
    </div>
    )
};

export default ItemList;