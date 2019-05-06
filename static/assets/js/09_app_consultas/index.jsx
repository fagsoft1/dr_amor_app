import React, {Component} from 'react';
import ResumenVentasEmpresas from './resumen_ventas_empresas/resumen_ventas_empresas';

class App extends Component {
    render() {
        return (
            <div className='text-center'>
                <ResumenVentasEmpresas/>
            </div>
        )
    }
}

export default App;