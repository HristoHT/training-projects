// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useDispatch, useSelector } from "react-redux";
import { setProductFieldAction } from "../../Utils/store/actions";
import api from '../../Utils/api';

export default function Asynchronous() {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;
    const dispatch = useDispatch();
    const setProductField = (field, value) => dispatch(setProductFieldAction({ field, value }));
    const measures = useSelector(state => state.product.measures)

    const changeField = (field) => (e, value) => {
        console.log(value);
        setProductField(field, value);
    }

    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        api.request('GET', 'measures')()
            .then(data => {
                if (active) {
                    setOptions([...data]);
                }
            })

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (<>
        <Autocomplete
            multiple
            limitTags={4}
            fullWidth
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => {
                return option.name === value.name
            }}
            onChange={changeField('measures')}
            value={measures}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    </>
    );
}