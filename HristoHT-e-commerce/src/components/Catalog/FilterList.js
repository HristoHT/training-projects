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
import { formatNumber, getNumber, toNumber } from "../../utils/NumberFormat";
import { fil } from "date-fns/locale";
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
    priceFrom: 0,
    priceTo: 100,
    brands: []
}

function FilterListst({ request, dataBrands, dataMaxPrice, dataOptions }) {
    const classes = useStyles();
    const [value, setValue] = useState([0, 37]);
    const [marks, setMarks] = useState([]);
    const [brands, setBrands] = useState([])
    const [maxPrice, setMaxPrice] = useState(100)
    const [filters, setFilters] = useState({ ...defaultFilters });

    useEffect(() => {
        console.log(dataBrands)
        setMaxPrice(dataMaxPrice);
        setBrands(dataBrands);
 
        setMarks([
            { value: 0, label: '0лв' },
            { value: getNumber(dataMaxPrice), label: `${formatNumber(dataMaxPrice)}лв.` }
        ]);

    }, [dataMaxPrice, dataBrands])

    useEffect(() => {
        setFilters({ ...defaultFilters, ...dataOptions });
    }, [dataOptions]);

    const handleChange = (event, newValue) => {
        setFilters({ ...filters, priceFrom: newValue[0], priceTo: newValue[1] });
        setValue(newValue);
    };

    const addBrand = (brand) => (e) => {
        let filterBrands = [...filters.brands];
        if (e.target.checked) {
            if (filterBrands.indexOf(brand) === -1) {
                filterBrands.push(brand);
            }
        } else {
            filterBrands.splice(filterBrands.indexOf(brand), 1);
        }
        setFilters({ ...filters, brands: filterBrands });
    }

    const changeSearch = (e) => {
        setFilters({ ...filters, search: e.target.value });
    }

    const handleSearch = (e) => {
        request({ ...filters });
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
                            value={filters.search}
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
                        <FormGroup aria-label="position" row>
                            {brands.map(brand => (
                                <FormControlLabel
                                    value="start"
                                    key={brand}
                                    control={<Checkbox color="primary"
                                        onClick={addBrand(brand)}
                                        checked={filters.brands.indexOf(brand) !== -1 ? true : false} />}
                                    label={brand}
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