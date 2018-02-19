import React, {Component} from 'react';
import {Link} from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <div>
                Tienda
                <Link to='/app/servicios/'>Servicios</Link>
            </div>
        )
    }
}

export default App;