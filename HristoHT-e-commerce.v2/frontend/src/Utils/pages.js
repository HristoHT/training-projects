import React, { useEffect } from 'react';
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

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Grid from '@material-ui/core/Grid';
import HomeIcon from '@material-ui/icons/Home';
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from 'notistack';
import { changeUserAction } from "./store/actions";
import api from "./api";

import Measures from '../Components/Measures/Mesures';
import { findAllByTestId } from '@testing-library/react';

const pages = {
    test: {
        path: '/test',
        permission: ['admin', 'user'],
        exact: true,
        private: false,
        component: (props) => (<Measures {...props} >Основна страница</Measures>)
    },
    productPanel: {
        path: '/productpanel',
        permission: ['admin', 'user'],
        admin: true,
        exact: true,
        private: false,
        component: (props) => (<ProductPanel {...props} >Основна страница</ProductPanel>)
    },
    default: {
        path: '/',
        permission: [],
        admin: false,
        exact: true,
        private: false,
        component: (props) => (<Catalog {...props} >Основна страница</Catalog>)
    }, login: {
        path: '/login',
        permission: [],
        exact: true,
        private: false,
        component: (props) => (<Login {...props} />)
    }, loginAdmin: {
        path: '/admin/login',
        permission: [],
        exact: true,
        private: false,
        component: (props) => (<Login admin={true} {...props} />)
    }, register: {
        path: '/register',
        permission: [],
        exact: true,
        private: false,
        component: (props) => (<Register {...props} />)
    }, catalog: {
        path: '/catalog',
        permission: [],
        exact: true,
        admin: false,
        private: true,
        component: (props) => (<div {...props} />)
    }, cart: {
        path: '/cart',
        permission: [],
        admin: false,
        exact: true,
        private: true,
        component: (props) => (<Cart {...props} />)
    }, iteminfo: {
        path: '/iteminfo/:id',
        permission: ['admin', 'user'],
        exact: true,
        private: true,
        component: (props) => (<div {...props} />)
    }, purchases: {
        path: '/purchases',
        permission: ['admin'],
        exact: true,
        private: true,
        component: (props) => (<div {...props} />)
    },
}

const pagesButtons = {
    default: {
        icon: (props) => <HomeIcon />,
        text: 'Каталог',
        position: 'left'
    }, catalog: {
        icon: (props) => <HomeIcon />,
        text: 'Каталог',
        position: 'left'
    }, productPanel: {
        icon: (props) => null,
        text: 'Продукти',
        position: 'left'
    }, cart: {
        icon: (props) => null,
        text: 'Количка',
        position: 'right'
    }/* , iteminfo: {
        icon: (props) => null,
        text: 'Информация',
        position: 'right'
    } */, purchases: {
        icon: (props) => null,
        text: 'Поръчки',
        position: 'right'
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
    return <Switch>
        {Object.keys(pages).map(pageName => {
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
    const user = useSelector(state => state.user)
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const changeUser = user => dispatch(changeUserAction(user));

    useEffect(() => {
    //    api.getUser();
       changeUser(api.getUser());
    }, [])

    return <Grid container className={classes.root}>
        <Grid item xs container justify="flex-start">
            {Object.keys(pagesButtons)
                .filter(key => {
                    let f1 = pagesButtons[key].position === 'left';
                    let f2 = pages[key].permission.indexOf(user.role) === -1 ? false : true;

                    return f1 && (f2 || (user.admin && pages[key].admin));
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
                    let f1 = pagesButtons[key].position === 'right';
                    // let f2 = pages[key].permission.indexOf(user.role) === -1 ? false : true;

                    return f1; /* && ( *//* f2 || *//*  (user.admin && pages[key].admin)) */;
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
                <Button startIcon={<ExitToAppIcon />} component={Link} to='/login' onClick={() => {
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