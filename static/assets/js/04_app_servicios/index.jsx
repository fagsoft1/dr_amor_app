import React, {Component} from 'react';
import {Link} from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <div>
                Servicios
                <Link to='/app/admin/'>Admin</Link>
            </div>
        )
    }
}
export default App;