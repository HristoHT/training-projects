import React, { useState, useEffect } from "react";
import { fade, makeStyles } from '@material-ui/core/styles';
import { green, purple, blue } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Button } from "@material-ui/core";
import api from "../../Utils/api";
import { useDispatch } from "react-redux";
import { setProductsAction } from "../../Utils/store/actions";
import { toNumber, getNumber, formatNumber } from "../../Utils/NumberFormat";
const useStyles = makeStyles((theme) => ({
    padding: {
        padding: 20,
        flexGrow: 1,
    },
    models: {
        maxHeight: '40vh',
        overflowY: 'auto'
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(blue[300], 0.15),
        '&:hover': {
            backgroundColor: fade(blue[400], 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    color: {
        backgroundColor: 'red'
    }
}));

function valuetext(value) {
    return `${value}лв.`;
}

const defaultFilters = {
    search: '',
    measuresList: [],
    priceFrom: 0,
    priceTo: 1000,
    visable: true
}

function FilterListst({ request, dataBrands, dataMaxPrice, dataOptions }) {
    const classes = useStyles();
    const [measures, setMeasures] = useState([]);
    const [value, setValue] = useState([0, 37]);
    const [filters, setFilters] = useState({ ...defaultFilters });
    const [maxPrice, setMaxPrice] = useState(1000);
    const [marks, setMarks] = useState([]);

    const dispatch = useDispatch();
    const setProducts = products => dispatch(setProductsAction(products));

    const handleChange = (event, newValue) => {
        setFilters({ ...filters, priceFrom: newValue[0], priceTo: newValue[1] });
        setValue(newValue);
    };

    const handleSearch = () => {

    }

    useEffect(() => {
        api.request('GET', 'products', { queries: filters })()
            .then(data => {
                setProducts(data);
            });
    }, [filters])

    useEffect(() => {
        api.request('GET', 'measures')()
            .then(data => {
                console.log(data);
                setMeasures(data);
            });

        api.request('GET', 'products', { param: '/maxprice' })()
            .then(data => {
                console.log(data);
                setMaxPrice(data.maxPrice);
                setMarks([
                    { value: 0, label: '0лв' },
                    { value: getNumber(data.maxPrice), label: `${formatNumber(data.maxPrice)}лв.` }
                ]);
            });

    }, []);

    const changeSearch = (e) => {
        setFilters({ ...filters, search: e.target.value });
    }

    const changeMeasure = (measure_id) => (e) => {
        let newFilterMeasures = [...filters.measuresList];

        if (e.target.checked) {
            newFilterMeasures.push(measure_id);
        } else {
            let index = newFilterMeasures.indexOf(measure_id);

            if (index !== -1) {
                newFilterMeasures.splice(index, 1);
            }
        }

        setFilters({ ...filters, measuresList: newFilterMeasures })
    }

    return (
        <div>
            <Grid container component={Paper} className={classes.padding} justify="flex-start" direction="row">
                <Grid item xs={12}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Търси..."
                            onChange={changeSearch}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            // value={''}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                </Grid>
                <Grid item xs={12} container spacing={3} className={classes.padding}>
                    <Grid item xs={12}>
                        <Typography id="range-slider" gutterBottom>
                            Цена
                    </Typography>
                        <Slider
                            value={[toNumber(filters.priceFrom), toNumber(filters.priceTo)]}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            marks={marks}
                            min={0}
                            max={toNumber(maxPrice)}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} container spacing={3} className={classes.models}>
                    <Grid item xs={12}>
                        <Typography id="range-slider" gutterBottom>
                            Модел
                    </Typography>
                        <FormGroup row>
                            {measures.map(measure => (
                                <FormControlLabel
                                    value="start"
                                    key={measure.id}
                                    control={<Checkbox color="primary"
                                        onClick={changeMeasure(measure.id)} />}
                                    // checked={filters.brands.indexOf(brand) !== -1 ? true : false} />}
                                    label={measure.name}
                                    labelPlacement="end"
                                />
                            ))}
                        </FormGroup>
                    </Grid>
                </Grid>
                <Grid item xs container justify="center">
                    <Grid item>
                        <Button variant="outlined" color="primary" onClick={handleSearch}>
                            Търси
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
};

export default FilterListst;