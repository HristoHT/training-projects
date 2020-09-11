import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import AccountCircle from '@material-ui/icons/AccountCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Alert from '@material-ui/lab/Alert';
import { useHistory, useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";

import api from '../../Utils/api';
import pages from '../../Utils/pages';
import { useSnackbar } from 'notistack';
import { useDispatch } from "react-redux";
import { changeUserAction } from "../../Utils/store/actions";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 25,
        //margin: '20vh',
        marginTop: '10vh'
    },
    container: {
        backgroundColor: 'red'
    }
}));

const Login = ({ goTo, admin, ...props }) => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({ name: '', password: '' });
    const history = useHistory();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const changeUser = user => dispatch(changeUserAction(user));

    const handlePasswordClick = (val) => (e) => {
        setShowPassword(val);
    }

    const changeField = (field) => (e) => {
        setCredentials({ ...credentials, [field]: e.target.value });
    }

    const handleLogin = async (e) => {
        const [, endpoint] = location.pathname.split('/');
        api.login(credentials, admin)
            .then(res => {
                enqueueSnackbar('Добре дошли', { variant: "success" });
                changeUser(res.user || {});
                history.push(goTo && goTo !== `/${endpoint}/login` ? goTo : pages[endpoint].path);
            })
            .catch(err => {
                enqueueSnackbar(err.message, { variant: "error" });
                console.log(err)
            });
    }

    useEffect(() => {
        return () => {
            setCredentials({ name: '', password: '' });
        }
    }, [])

    return (
        <Grid container justify="space-evenly">
            <Grid item xs={12} sm={12} md={6} lg={4} container
                alignItems="center"
                justify="center"
                direction='column'
                component={Paper}
                className={classes.root}
                spacing={3}>
                {/* {goTo} */}
                <Grid item xs>
                    <Typography variant="h5" color="primary">
                        Вход
                    </Typography>
                </Grid>
                <Grid item xs container spacing={1} alignItems="flex-end" justify="center">
                    <Grid item>
                        <AccountCircle color="primary" />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Потребител"
                            onChange={changeField('name')}
                            defaultValue={credentials.name} />
                    </Grid>
                </Grid>
                <Grid item xs container spacing={1} alignItems="flex-end" justify="center">
                    <Grid item onClick={handlePasswordClick(!showPassword)}>
                        {showPassword ? <Visibility color="primary" /> : <VisibilityOff color="primary" />}
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Парола"
                            type={showPassword ? 'text' : 'password'}
                            onChange={changeField('password')}
                            defaultValue={credentials.password} />
                    </Grid>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="primary" onClick={handleLogin}>
                        Влез
                    </Button>
                </Grid>
                <Grid>
                    <Link to="/register">
                        Направете си регистрация
                    </Link>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Login;