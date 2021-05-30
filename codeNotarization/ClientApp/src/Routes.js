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
import { Login } from "./components/Login";


//const PrivateRoute = ({ component: Component, ...rest }) => (
//    <Route {...rest} render={props => (
//        isAuthenticated() ? (
//            <Component {...props} />
//        ) : (
//                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
//            )
//    )} />
//);

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
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            )
    )} />
);

const PrivateRouteP = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated() ? (
            (decode(localStorage.getItem('token')).Store[0] == 'P') ?
                <Component {...props} />
                : (decode(localStorage.getItem('token')).Store[0] == 'M') ?
                    <Redirect to={{ pathname: '/perfilMedico', state: { from: props.location } }} />
                    : < Redirect to={{ pathname: '/perfilAdmin', state: { from: props.location } }} />
        ) : (
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            )
    )} />
);

const PrivateRouteA = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated() ? (
            (decode(localStorage.getItem('token')).Store[0] == 'A') ?
                <Component {...props} />
                : (decode(localStorage.getItem('token')).Store[0] == 'M') ?
                    <Redirect to={{ pathname: '/perfilMedico', state: { from: props.location } }} />
                    : < Redirect to={{ pathname: '/perfilPaciente', state: { from: props.location } }} />
        ) : (
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            )
    )} />
);

const PrivateRouteM = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated() ? (
            (decode(localStorage.getItem('token')).Store[0] == 'M') ?
                <Component {...props} />
                : (decode(localStorage.getItem('token')).Store[0] == 'P') ?
                    <Redirect to={{ pathname: '/perfilPaciente', state: { from: props.location } }} />
                    : < Redirect to={{ pathname: '/perfilAdmin', state: { from: props.location } }} />
        ) : (
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            )
    )} />
);


const AuthRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        !isAuthenticated() ? (
            <Component {...props} />
        ) : (
                (decode(localStorage.getItem('token')).Store[0] == 'P') ?
                    <Redirect to={{ pathname: '/perfilPaciente', state: { from: props.location } }} />
                    : (decode(localStorage.getItem('token')).Store[0] == 'M') ?
                        <Redirect to={{ pathname: '/perfilMedico', state: { from: props.location } }} />
                        : < Redirect to={{ pathname: '/perfilAdmin', state: { from: props.location } }} />
            )
    )} />
);

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <AuthRoute exact path='/' component={Home} />
            <AuthRoute exact path='/privacy' component={Privacy} />
            <AuthRoute exact path='/info' component={InfoDocument} />
            <AuthRoute exact path='/perfil' component={Perfil} />
            <AuthRoute exact path='/documentos' component={Documentos} />
            <AuthRoute exact path='/registarDoc' component={RegistarDoc} />
            <AuthRoute exact path='/login' component={Login} />
            <AuthRoute exact path='/logout' component={Logout} />
        </Switch>
    </BrowserRouter>
);

export default Routes;