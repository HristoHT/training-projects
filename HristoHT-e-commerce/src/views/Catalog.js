import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Loader from '../components/Loader';

import api from '../utils/api';
import pages from '../utils/pages';

import ItemList from '../components/Catalog/ItemList';
import FilterList from '../components/Catalog/FilterList';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: 25,
    },
    container: {
        backgroundColor: 'red'
    }
}));

const Login = ({ goTo, ...props }) => {
    const classes = useStyles();
    const [result, setResult] = useState({ data: [], maxPrice: 0, brands: [], loading: false });

    const request = (queries = {}) => {
        setResult({ ...result, loading: true });
        console.log(queries)
        api.request('GET', 'items', { queries })()
            .then(res => {
                console.log(res);
                console.log('Values returned')
                let brands = [];
                if (res.options.brands) {
                    brands = res.options.brands.split(',');
                }
                res.options.brands = brands;
                setResult({ ...res, loading: false });
            }).catch(err => {
                console.log('Error')
                console.log(err);
            });
    }

    useEffect(() => {
        request();
    }, [])

    return <div className={classes.root}>
        {result.loading && <Loader />}
        {!result.loading && <Grid container spacing={3} >
            <Grid item xs={12} md={3} container>
                <FilterList request={request}
                    dataBrands={result.brands}
                    dataMaxPrice={result.maxPrice}
                    dataOptions={result.options} />
            </Grid>
            <Grid item xs container>
                <ItemList data={result.data} />
            </Grid>
        </Grid>}

    </div>
}

export default Login;