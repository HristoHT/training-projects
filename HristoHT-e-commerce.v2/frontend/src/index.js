import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route, Switch, Redirect } from "react-router-dom";
import PrivateRoute from './Components/Utils/PrivateRoute';
import { Router } from 'react-router';

import history from './Utils/history';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { orange, blue, red } from '@material-ui/core/colors';

import { Provider } from 'react-redux';
import store from './Utils/store/store';

import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import format from "date-fns/format";

import bg from "date-fns/locale/bg";
import pages, { FormRoutes } from "./Utils/pages";
import { SnackbarProvider, useSnackbar } from 'notistack';
import TopNavbar from './Components/Navbar/TopNavbar';

/**
 * Datepicker's date format type
 */
class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "dd.mm.yyyy");
  }
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: red[500],
    },
  },

});

theme.typography.h4 = {
  fontSize: '1rem',
  '@media (min-width:600px)': {
    fontSize: '1.6rem',
  },
  '@media (max-width:320px)': {
    fontSize: '0.5rem',
  },
};

ReactDOM.render(
  <React.StrictMode>
    <MuiPickersUtilsProvider locale={bg} utils={LocalizedUtils}> {/** for datepickers */}
      <Provider store={store}> {/** Redux store */}
        <Router history={history}> {/** React history */}
          <ThemeProvider theme={theme}> {/** Material UI Theme provider */}
            <SnackbarProvider maxSnack={3}>
              <TopNavbar/>
              <FormRoutes/>
            </SnackbarProvider>
          </ThemeProvider>
        </Router>
      </Provider>
    </MuiPickersUtilsProvider>
  </React.StrictMode >,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();