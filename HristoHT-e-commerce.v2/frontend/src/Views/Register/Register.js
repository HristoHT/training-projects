import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import api from '../../Utils/api';
import { useSnackbar } from 'notistack';

import { useHistory, Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 25,
        marginTop: '1vh'
    },
    container: {
        backgroundColor: 'red'
    }
}));

const defaultCredentials = {
    name: '',
    password: '',
    confirmPassword: '',
    email: ''
}

const Register = ({ ...props }) => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({ ...defaultCredentials });
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    const handlePasswordClick = (val) => (e) => {
        setShowPassword(val);
    }

    const changeField = (field) => (e) => {
        setCredentials({ ...credentials, [field]: e.target.value });
    }

    const handleRegister = async (e) => {
        api.register(credentials)
        .then(res => {
            enqueueSnackbar('Вие се регистрирахте успешно', { variant: "success" });
            history.push('/user/login');
        })
        .catch(err => enqueueSnackbar(err.message, { variant: "error" }));
    }

    useEffect(() => {
        return () => {
            setCredentials({ ...defaultCredentials });
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
                <Grid item xs>
                    <Typography variant="h5" color="primary">
                        Регистрация
                    </Typography>
                </Grid>
                <Grid item xs container spacing={1} alignItems="flex-end" justify="center">
                    <Grid item>
                        <MailIcon color="primary" />
                    </Grid>
                    <Grid item>
                        <TextField
                            type="email"
                            label="Майл адрес"
                            onChange={changeField('email')}
                            defaultValue={credentials.email} />
                    </Grid>
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
                <Grid item xs container spacing={1} alignItems="flex-end" justify="center">
                    <Grid item onClick={handlePasswordClick(!showPassword)}>
                        {showPassword ? <Visibility color="primary" /> : <VisibilityOff color="primary" />}
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Потвърди парола"
                            type={showPassword ? 'text' : 'password'}
                            onChange={changeField('confirmPassword')}
                            defaultValue={credentials.confirmPassword} />
                    </Grid>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="primary" onClick={handleRegister}>
                        Регистрирай се
                    </Button>
                </Grid>
                <Grid>
                    <Link to="/Register">
                        Вече имате регистрация?
                    </Link>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Register;