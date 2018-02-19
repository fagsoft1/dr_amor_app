import React, {Fragment} from 'react';
import App1 from "./index";
import {Route, Switch} from 'react-router-dom';

const Routes = (props) => {
    return (
        <div>
            Algo en Tienda
            <Switch>
                <Route exact path='/app/tienda/' component={App1}/>
            </Switch>
        </div>
    )
};

export default Routes;