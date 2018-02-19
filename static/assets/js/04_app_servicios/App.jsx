import React from 'react';
import App1 from "./index";
import {Route, Switch} from 'react-router-dom';

const Routes = (props) => {
    return (
        <div>
            Algo en Servicios
            <Switch>
                <Route exact path='/app/servicios/' component={App1}/>
            </Switch>
        </div>
    )
};

export default Routes;