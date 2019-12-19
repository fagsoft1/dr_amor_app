import React, {memo, useState, Fragment, useEffect} from 'react';
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import Typography from '@material-ui/core/Typography/index';

import DatoGeneralAplicacionForm from './DatoGeneralAplicacionForm';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from "../../../01_actions";

const ConfiguracionAplicacionDashboard = memo(() => {
    const [slideIndex, setSlideIndex] = useState(0);
    const singular_name = 'Configuraciones';
    const dispatch = useDispatch();
    let configuracion_aplicacion = useSelector(state => state.configuracion_aplicacion);

    useEffect(() => {
        dispatch(actions.fetchConfiguracionAplicacion())
    }, []);
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
                <Tab label="Datos Generales" value={0}/>
            </Tabs>
            {slideIndex === 0 && <Fragment>
                {configuracion_aplicacion &&
                <DatoGeneralAplicacionForm initialValues={configuracion_aplicacion['datos_generales']}
                                           logo={configuracion_aplicacion['datos_generales'].logo}/>}
            </Fragment>
            }
        </Fragment>
    )
});

export default ConfiguracionAplicacionDashboard;