import React, {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import CargarDatos from "../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../00_utilities/common";
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import Typography from '@material-ui/core/Typography/index';
import {
    TIPOS_VEHICULOS as bloque_1_permisos,
    MODALIDADES_FRACCIONES_TIEMPOS as bloque_2_permisos,
} from "../../../00_utilities/permisos/types";

import BloqueTiposVehiculos from './tipo_vehiculo/TipoVehiculoList';
import BloqueModalidadFraccionTiempo
    from './modalidades_fracciones_tiempo/ModalidadFraccionTiempoList';

const ListadoElementos = memo((props) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const dispatch = useDispatch();
    const modalidades_fracciones_tiempo = useSelector(state => state.parqueadero_modalidades_fracciones_tiempo);
    const tipos_vehiculos = useSelector(state => state.parqueadero_tipos_vehiculos);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const permisos_object_1 = permisosAdapter(mis_permisos, bloque_1_permisos);
    const permisos_object_2 = permisosAdapter(mis_permisos, bloque_2_permisos);
    useEffect(() => {
            dispatch(actions.fetchMisPermisosxListado([
                bloque_1_permisos,
                bloque_2_permisos
            ], {callback: () => cargarDatos()}));
            return () => {
                dispatch(actions.clearTiposVehiculos());
                dispatch(actions.clearModalidadesFraccionesTiempos());
            };
        }, []
    );

    const cargarDatos = () => {
        cargarElementos();
    };

    const cargarElementos = (value = null) => {
        let index = value !== null ? value : slideIndex;
        if (index === 0) {
            dispatch(actions.fetchTiposVehiculos())
        } else if (index === 1) {
            dispatch(actions.fetchModalidadesFraccionesTiempos())
        }
    };
    const handleChange = (event, value) => {
        if (value !== slideIndex) {
            cargarElementos(value);
        }
        setSlideIndex(value);
    };
    const can_see =
        permisos_object_1.list ||
        permisos_object_2.list;
    const plural_name = 'Panel Parqueadero';
    const singular_name = 'Panel Parqueadero';

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
                <Tab label="Tipos Vehiculos" value={0}/>
                <Tab label="Modalidades Parqueo" value={1}/>
            </Tabs>
            <div className="row">
                <div className="col-12">
                    {
                        slideIndex === 0 &&
                        <BloqueTiposVehiculos
                            {...props}
                            object_list={tipos_vehiculos}
                            permisos_object={permisos_object_1}
                        />
                    }
                    {
                        slideIndex === 1 &&
                        <BloqueModalidadFraccionTiempo
                            {...props}
                            object_list={modalidades_fracciones_tiempo}
                            permisos_object={permisos_object_2}
                            tipos_vehiculos_list={tipos_vehiculos}
                        />
                    }
                </div>
            </div>
            <CargarDatos
                cargarDatos={cargarDatos}
            />

        </ValidarPermisos>
    )

});


export default ListadoElementos;