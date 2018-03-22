import React, {Component} from 'react';

class App extends Component {
    render() {
        return (
            <div className='text-center'>
                <img className='img-fluid' src={`${img_static_url}/logo.png`} alt="logo"/>
            </div>
        )
    }
}

export default App;