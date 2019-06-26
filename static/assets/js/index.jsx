import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {registerObserver} from 'react-perf-devtool';

registerObserver();

ReactDOM.render(
    <App/>,
    document.querySelector('.app')
);
