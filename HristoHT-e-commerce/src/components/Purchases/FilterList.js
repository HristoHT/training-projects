import React, { useState, useEffect } from "react";
import { fade, makeStyles } from '@material-ui/core/styles';
import { green, purple, blue } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import toDate from '../../utils/DateFormat';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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

const startDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime();
}

const endDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).getTime();
}

const defaultFilter = {
    detailed: 'false',
    dateFrom: startDate(new Date()),
    dateTo: endDate(new Date()),
    search: '',
    priceTo: 10000,
    priceFrom: 0,
    detailed: 'false',
    type: ''
}

function FilterListst({ options, maxPrice, request }) {
    const classes = useStyles();
    const [value, setValue] = React.useState([20, 37]);
    const [marks, setMarks] = useState([])
    const [dateFrom, setDateFrom] = useState(toDate(new Date(), 'yyyy-mm-dd'));
    const [dateTo, setDateTo] = useState(toDate(new Date(), 'yyyy-mm-dd'));
    const [filters, setFilters] = useState({ ...defaultFilter });

    useEffect(() => {
        setMarks([
            { value: 0, label: '0лв' },
            { value: Number(maxPrice), label: `${maxPrice}лв` }

        ])
    }, [maxPrice]);

    useEffect(() => {
        setFilters({ ...filters, ...options });
    }, [options]);

    useEffect(() => {
        request(filters);
    }, [])

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

    const handleChange = (event, newValue) => {
        setFilters({ ...filters, priceTo: newValue[1], priceFrom: newValue[0] });
    };

    return (
        <div>
            <Grid container component={Paper}
                className={classes.padding}
                justify="flex-start"
                direction="row"
                spacing={2}>
                <Grid item xs={12}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            onChange={changeField('search')}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                </Grid>
                <Grid item xs={12} container justify="space-between">
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
                </Grid>
                <Grid item xs={12} container spacing={3} className={classes.padding}>
                    <Grid item xs={12}>
                        <Typography id="range-slider" gutterBottom>
                            Цена
                    </Typography>
                        <Slider
                            value={[filters.priceFrom, filters.priceTo]}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            marks={marks}
                            min={0}
                            max={maxPrice}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} container>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Статус</FormLabel>
                        <RadioGroup value={filters.type} onChange={changeField('type')} color="primary">
                            <FormControlLabel value="" control={<Radio color="primary" />} label="Всички" />
                            <FormControlLabel value="finished" control={<Radio color="primary" />} label="Завършени" />
                            <FormControlLabel value="not finished" control={<Radio color="primary" />} label="Незавършени" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs container spacing={3} justify="center">
                    <Grid item>
                        <Button color="primary" variant="outlined" onClick={() => request(filters)}>Изведи</Button>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
};

export default FilterListst;