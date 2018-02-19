import React, {Component} from 'react';
import {Link} from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <div className='text-center'>
                <img src={`${img_static_url}/logo.png`} alt="logo"/>
            </div>
        )
    }
}

export default App;