import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import decode from 'jwt-decode';

import { Home } from './components/Home';
import { Privacy } from "./components/Privacy";
import { InfoDocument } from "./components/InfoDocument";
import { Perfil } from "./components/Perfil";
import { Documentos } from "./components/Documentos";
import { RegistarDoc } from "./components/RegistarDoc";
import { Logout } from "./components/Logout";


const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    try {
        // { exp: 56654564 }
        var decoded = decode(token);
        console.log(decoded);

        console.log(new Date().getTime() / 1000);
        if (decoded.exp < new Date().getTime() / 1000) {
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated() ? (
            <Component {...props} />
        ) : (
                <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            )
    )} />
);


const AuthRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        !isAuthenticated() ? (
            <Component {...props} />
        ) : (
                <Redirect to={{ pathname: '/perfil', state: { from: props.location } }} />
            )
    )} />
);

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <AuthRoute exact path='/' component={Home} />
            <AuthRoute exact path='/privacy' component={Privacy} />
            <AuthRoute exact path='/info' component={InfoDocument} />
            <PrivateRoute exact path='/perfil' component={Perfil} />
            <PrivateRoute exact path='/documentos' component={Documentos} />
            <PrivateRoute exact path='/registarDoc' component={RegistarDoc} />
            <PrivateRoute exact path='/logout' component={Logout} />
        </Switch>
    </BrowserRouter>
);

export default Routes;