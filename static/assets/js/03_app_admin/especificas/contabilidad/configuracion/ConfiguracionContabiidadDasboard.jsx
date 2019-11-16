import React, {memo, useState, Fragment} from 'react';
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import Typography from '@material-ui/core/Typography/index';

import CuentasContables from './cuentas_contables/CuentaContableCRUD';
import DiariosContables from './diarios/DiarioContableCRUD';
import MetodosPagos from './metodos_pagos/MetodoPagoCrud';
import Impuestos from './impuestos/ImpuestoCRUD';

const ConfiguracionContabilidadDashboard = memo(() => {
    const [slideIndex, setSlideIndex] = useState(0);
    const singular_name = 'Configuraciones';
    return (
        <Fragment>
            <Typography variant="h5" gutterBottom color="primary">
                {singular_name}
            </Typography>

            <Tabs indicatorColor="primary"
                  textColor="primary"
                  onChange={(event, index) => setSlideIndex(index)}
                  value={slideIndex}
            >
                <Tab label="Diarios" value={0}/>
                <Tab label="Impuestos" value={1}/>
                <Tab label="Bancos" value={2}/>
                <Tab label="Cuentas Contables" value={3}/>
                <Tab label="Metodos de Pago" value={4}/>
            </Tabs>
            {slideIndex === 0 && <DiariosContables/>}
            {slideIndex === 1 && <Impuestos/>}
            {slideIndex === 2 && <div>Aqui Bancos</div>}
            {slideIndex === 3 && <CuentasContables/>}
            {slideIndex === 4 && <MetodosPagos/>}
        </Fragment>
    )
});

export default ConfiguracionContabilidadDashboard;