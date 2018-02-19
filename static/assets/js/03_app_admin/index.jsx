import React, {Component} from 'react';
import {Link} from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <div>
                Admin
                <Link to='/app/tienda/'>Tienda</Link>
            </div>
        )
    }
}

export default App;