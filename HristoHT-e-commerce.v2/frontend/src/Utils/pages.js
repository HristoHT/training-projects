import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Route, Switch, Link } from "react-router-dom";
import PrivateRoute from '../Components/Utils/PrivateRoute';

import Login from '../Views/Login/Login';
import Register from '../Views/Register/Register';
// import Catalog from '../views/Catalog';
import AddItem from '../Components/ProuctPanel/ItemDialog';
import ProductPanel from "../Views/ProductPanel/ProductPanel";
import Catalog from '../Views/Catalog/Catalog';
// import ItemInfo from '../views/ItemInfo';
import Cart from '../Views/Cart/Cart';
// import Purchases from '../views/Purchases';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Grid from '@material-ui/core/Grid';
import HomeIcon from '@material-ui/icons/Home';
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from 'notistack';
import { changeUserAction } from "./store/actions";
import { useLocation } from "react-router-dom";
import api from "./api";

import Measures from '../Components/Measures/Mesures';

const pages = {
    test: {
        path: '/test',
        permission: ['admin', 'user'],
        exact: true,
        private: false,
        admin: false,
        component: (props) => (<Measures {...props} >Основна страница</Measures>)
    },
    user: {
        path: '/user/',
        permission: [],
        admin: false,
        exact: true,
        private: false,
        component: (props) => (<Catalog {...props} >Основна страница</Catalog>)
    }, login: {
        path: '/user/login',
        permission: [],
        exact: true,
        admin: false,
        private: false,
        component: (props) => (<Login {...props} />)
    }, register: {
        path: '/user/register',
        permission: [],
        exact: true,
        admin: false,
        private: false,
        component: (props) => (<Register {...props} />)
    }, catalog: {
        path: '/user/catalog',
        permission: [],
        exact: true,
        admin: false,
        private: true,
        component: (props) => (<Catalog {...props} />)
    }, cart: {
        path: '/user/cart',
        permission: [],
        admin: false,
        exact: true,
        private: true,
        component: (props) => (<Cart {...props} />)
    }, productPanel: {
        path: '/admin/productpanel',
        permission: [],
        admin: true,
        exact: true,
        private: false,
        component: (props) => (<ProductPanel {...props} >Основна страница</ProductPanel>)
    }, loginAdmin: {
        path: '/admin/login',
        permission: [],
        exact: true,
        admin: true,
        private: false,
        component: (props) => (<Login admin={true} {...props} />)
    }, admin: {
        path: '/admin/',
        permission: [],
        exact: true,
        admin: true,
        private: false,
        component: (props) => (<div admin={true} {...props} />)
    }
}

const pagesButtons = {
    productPanel: {
        icon: (props) => null,
        text: 'Продукти',
        position: 'left'
    }, cart: {
        icon: (props) => null,
        text: 'Количка',
        position: 'right'
    }, catalog: {
        icon: (props) => <HomeIcon />,
        text: 'Каталог',
        position: 'left'
    }
}

const pageButonsWithoutUser = {
    login: {
        icon: (props) => null,
        text: 'Вход',
        position: 'right'
    }, register: {
        icon: (props) => null,
        text: 'Регистрация',
        position: 'right'
    }
}

export const FormRoutes = () => {
    const user = useSelector(state => state.user);
    const location = useLocation();
    const dispatch = useDispatch();
    const changeUser = user => dispatch(changeUserAction(user));

    useEffect(() => {
        changeUser(api.getUser());
    }, [location.pathname])

    return <Switch>
        {Object.keys(pages).filter(pageName => {
            if (pages[pageName].private) {
                return pages[pageName].admin === user.admin;
            } else {
                return true;
            }
        }).map(pageName => {
            if (pages[pageName].private) {
                return <PrivateRoute key={pageName} {...pages[pageName]} />
            } else {
                return <Route key={pageName} {...pages[pageName]} />
            }
        })}
    </Switch>
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

export const FormButtons = (Button) => {
    const classes = useStyles();
    const user = useSelector(state => state.user);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const changeUser = user => dispatch(changeUserAction(user));
    const location = useLocation();
    const [endpoint, setEndpoint] = useState('user');

    useEffect(() => {
        changeUser(api.getUser());
        const [, endp] = location.pathname.split('/');
        setEndpoint(endp);
    }, [location.pathname])
    // window.localStorage.setItem('user', '{}');

    return <Grid container className={classes.root}>
        <Grid item xs container justify="flex-start">
            {Object.keys(pagesButtons)
                .filter(key => {
                    const f1 = pagesButtons[key].position === 'left';
                    const f2 = pages[key].admin === user.admin;

                    return f1 && f2;
                })
                .map(key => (
                    <Grid item>
                        <Button startIcon={pagesButtons[key].icon()} component={Link} to={pages[key].path}>
                            {pagesButtons[key].text}
                        </Button>
                    </Grid>
                ))}
        </Grid>
        <Grid item xs container justify="flex-end">
            {Object.keys(pagesButtons)
                .filter(key => {
                    const f1 = pagesButtons[key].position === 'right';
                    const f2 = pages[key].admin === user.admin;

                    return f1 && f2;
                })
                .map(key => (
                    <Grid item>
                        <Button startIcon={pagesButtons[key].icon()} component={Link} to={pages[key].path}>
                            {pagesButtons[key].text}
                        </Button>
                    </Grid>
                ))}

            {!user.name && Object.keys(pageButonsWithoutUser)
                .map(key => (
                    <Grid item>
                        <Button startIcon={pageButonsWithoutUser[key].icon()} component={Link} to={pages[key].path}>
                            {pageButonsWithoutUser[key].text}
                        </Button>
                    </Grid>
                ))}

            {user.name && <Grid item>
                <Button startIcon={<ExitToAppIcon />} component={Link} to={`/${endpoint}/login`} onClick={() => {
                    api.logout()
                        .then(res => {
                            enqueueSnackbar('Вие излязохте успешно', { variant: "success" });
                            changeUser({});
                        })
                        .catch(err => {
                            console.log(err);
                        });

                }}>
                    Изход
                </Button>
            </Grid>}
        </Grid>
    </Grid>
}

export default pages;