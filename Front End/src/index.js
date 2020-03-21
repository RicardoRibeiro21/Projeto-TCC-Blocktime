import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './Pages/Login/login';
import * as serviceWorker from './serviceWorker'
import Site from './Services/siteBlocktime'
import HostGroups from './Pages/HostGroups/listarHostGroups'
import Hosts from './Pages/ListarHosts/listarHosts'
import Eventos from './Pages/ListarEvents/listarEvents'
import Graficos from './Pages/Grafico/grafico'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Editar from './Pages/Usuario/editar';
ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path='/Site' component={() => { window.location.href = Site; return null; }} />
            <Route path="/" exact={true} component={App} />
            <Route path="/Login" component={Login} />
            <Route path="/Hostgroups" component={HostGroups} />
            <Route path="/Hosts" component={Hosts} />
            <Route path="/Eventos" component={Eventos} />
            <Route path="/Grafico" component={Graficos} />
            <Route path="/EditarUsuario" component={Editar} />
        </Switch>
    </ BrowserRouter>
    , document.getElementById('root'));

serviceWorker.unregister();