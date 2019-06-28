import React, {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../00_utilities/common";
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import Typography from '@material-ui/core/Typography/index';
import {
    CUENTAS_CONTABLES as bloque_1_permisos,
    DIARIOS_CONTABLES as bloque_2_permisos,
    IMPUESTOS as bloque_3_permisos,
} from "../../../../00_utilities/permisos/types";

import CuentasContables from './cuentas_contables/CuentaContableCRUD';
import DiariosContables from './diarios/DiarioContableCRUD';
import Impuestos from './impuestos/ImpuestoCRUD';

const ListadoElementos = memo(() => {
    const dispatch = useDispatch();
    const [slideIndex, setSlideIndex] = useState(0);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const cuentas_contables = useSelector(state => state.contabilidad_cuentas_contables);
    const diarios_contables = useSelector(state => state.contabilidad_diarios_contables);
    const impuestos = useSelector(state => state.contabilidad_impuestos);


    const permisos_object_1 = permisosAdapter(mis_permisos, bloque_1_permisos);
    const permisos_object_2 = permisosAdapter(mis_permisos, bloque_2_permisos);
    const permisos_object_3 = permisosAdapter(mis_permisos, bloque_3_permisos);
    useEffect(() => {
            dispatch(actions.fetchMisPermisosxListado([
                bloque_1_permisos,
                bloque_2_permisos,
                bloque_3_permisos
            ], {callback: () => cargarDatos()}));
            return () => {
                dispatch(actions.clearCuentasContables());
                dispatch(actions.clearDiariosContables());
                dispatch(actions.clearImpuestos());
            };
        }, []
    );

    const cargarDatos = () => {
        cargarElementos();
    };

    const cargarElementos = (value = null) => {
        let index = value !== null ? value : slideIndex;
        if (index === 0) {
            dispatch(actions.fetchDiariosContables());
        } else if (index === 1) {
            dispatch(actions.fetchCuentasContablesDetalles());
            dispatch(actions.fetchImpuestos());
        } else if (index === 3) {
            dispatch(actions.fetchCuentasContables());
        }
    };
    const handleChange = (event, value) => {
        if (value !== slideIndex) {
            cargarElementos(value);
        }
        setSlideIndex(value);
    };

    const can_see = permisos_object_1.list ||
        permisos_object_2.list ||
        permisos_object_3.list;
    const plural_name = 'Configuraciones';
    const singular_name = 'Configuraciones';


    return (

        <ValidarPermisos can_see={can_see} nombre={plural_name}>
            <Typography variant="h5" gutterBottom color="primary">
                {singular_name}
            </Typography>

            <Tabs indicatorColor="primary"
                  textColor="primary"
                  onChange={handleChange}
                  value={slideIndex}
            >
                <Tab label="Diarios" value={0}/>
                <Tab label="Impuestos" value={1}/>
                <Tab label="Bancos" value={2}/>
                <Tab label="Cuentas Contables" value={3}/>
            </Tabs>
            {
                slideIndex === 0 &&
                <DiariosContables
                    posSummitMethod={() => cargarDatos()}
                    con_titulo={false}
                    object_list={diarios_contables}
                    permisos_object={permisos_object_2}
                />
            }
            {
                slideIndex === 1 &&
                <Impuestos
                    cuentas_contables={cuentas_contables}
                    posSummitMethod={() => cargarDatos()}
                    con_titulo={false}
                    object_list={impuestos}
                    permisos_object={permisos_object_3}
                />
            }
            {
                slideIndex === 2 &&
                <div>Aqui Bancos</div>
            }
            {
                slideIndex === 3 &&
                <CuentasContables
                    cuentas_contables={cuentas_contables}
                    posSummitMethod={() => cargarDatos()}
                    con_titulo={false}
                    object_list={cuentas_contables}
                    permisos_object={permisos_object_1}
                />
            }
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </ValidarPermisos>
    )
});

export default ListadoElementos;