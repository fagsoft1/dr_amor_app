import React, {memo} from 'react';

const App = memo(() => {
    return (
        <div className='text-center'>
            <img className='img-fluid' src={`${img_static_url}/logo.png`} alt="logo"/>
        </div>
    )
});
export default App;