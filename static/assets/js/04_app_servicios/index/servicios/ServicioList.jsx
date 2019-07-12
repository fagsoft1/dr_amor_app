import React, {useState, memo, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../../../01_actions';

import ServicioListItem from './ServicioListItem';
import useInterval from "../../../00_utilities/hooks/useInterval";

const ServicioList = memo(props => {
    const dispatch = useDispatch();
    const servicios = useSelector(state => state.servicios);
    const auth = useSelector(state => state.auth);
    const {abrirModalServicio, cargarServiciosEnProceso} = props;
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        dispatch(
            actions.fetchServicios_en_proceso(
                {
                    limpiar_coleccion: false,
                    show_cargando: false
                }
            )
        );
        return () => dispatch(actions.clearServicios());
    }, []);


    useInterval(() => {
        if (cargarServiciosEnProceso) {
            dispatch(
                actions.fetchServicios_en_proceso(
                    {
                        limpiar_coleccion: false,
                        show_cargando: false
                    }
                )
            )
        }
    }, 5000);

    const terminarServicio = (servicio_id) => {
        const {user: {punto_venta_actual}} = auth;
        const cargarHabitaciones = () => dispatch(actions.fetchHabitaciones());
        const cargarServiciosEnProceso = () => dispatch(actions.fetchServicios_en_proceso({callback: cargarHabitaciones}));
        dispatch(actions.terminarServicio(servicio_id, punto_venta_actual.id, {callback: cargarServiciosEnProceso}));
    };

    const onBusquedaChange = (event) => {
        setBusqueda(event.target.value);
    };

    const cargarServicio = (id) => {
        dispatch(actions.fetchServicio(id));
    };

    const servicios_ordenados = _.orderBy(servicios, ['hora_final'], ['asc']);
    let servicios_activos = _.pickBy(servicios_ordenados, servicio => {
        return servicio.estado === 1
    });

    if (busqueda !== '') {
        servicios_activos = _.pickBy(servicios_ordenados, servicio => {
            return (
                servicio.acompanante_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                servicio.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
                servicio.habitacion_nombre.toLowerCase().includes(busqueda.toLowerCase())
            )
        })
    }

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <div className="md-form">
                        <input id="busqueda" className="form-control" type="text"
                               value={busqueda}
                               placeholder="Modelo a buscar..."
                               onChange={onBusquedaChange}/>
                    </div>
                </div>
                {_.map(servicios_activos, (servicio) => {
                    return <ServicioListItem
                        abrirModalServicio={abrirModalServicio}
                        cargarServicio={cargarServicio}
                        terminarServicio={terminarServicio}
                        key={servicio.id}
                        servicio={servicio}
                    />
                })}
            </div>
        </div>
    )

});

export default ServicioList;