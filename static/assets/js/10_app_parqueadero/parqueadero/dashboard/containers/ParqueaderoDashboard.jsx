import React, {memo, useState, useEffect} from 'react';
import PrinJs from 'print-js';
import Badge from '@material-ui/core/Badge';
import useInterval from '../../../../00_utilities/hooks/useInterval';

import EntradaParqueaderoDialog from '../../entrada/components/EntredaParqueaderoModal';
import SalidaParqueaderoDialog from '../../salida/components/SalidaParqueaderoModal';
import CajaParqueaderoDialog from '../../caja/components/CajaModal';
import VehiculoParqueaderoListado from '../components/VehiculoParqueaderoList';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions";
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const styles = {
    table: {
        fontSize: '0.8rem',
        td: {
            padding: '0',
            margin: '0',
            paddingLeft: '3px',
            paddingRight: '3px',
            border: '1px solid black'
        },
        td_right: {
            padding: '0',
            margin: '0',
            paddingRight: '3px',
            paddingLeft: '3px',
            textAlign: 'right',
            border: '1px solid black'
        },
        td_total: {
            padding: '0',
            margin: '0',
            paddingRight: '3px',
            paddingLeft: '3px',
            textAlign: 'right',
            borderBottom: 'double 3px'
        },
        tr: {
            padding: '0',
            margin: '0',
        }
    },
};

const DashboardParqueadero = memo(props => {
    const dispatch = useDispatch();
    const [busqueda, setBusqueda] = useState('');
    const [entrada_dialog_open, setEntradaDialogOpen] = useState(false);
    const [salida_dialog_open, setSalidaDialogOpen] = useState(false);
    const [caja_dialog_open, setCajaDialogOpen] = useState(false);
    const [actual_time, setActualTime] = useState(Date.now());
    const [vehiculo_parqueadero_seleccionado, setVehiculoParqueaderoSeleccionado] = useState(null);
    const [info_pago, setInfoPago] = useState(null);
    const registros_entradas_parqueos = useSelector(state => state.parqueadero_registros_entradas_parqueos);
    const cargarDatos = () => dispatch(actions.fetchRegistrosEntradasParqueos_por_salir());


    const onImprimirComprobante = (id) => {
        const callback_impresion = (response) => {
            const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
            PrinJs(url);
        };
        dispatch(actions.printReciboEntradaParqueadero(id, {callback: callback_impresion}));
    };

    const onImprimirFactura = (id) => {
        const callback_impresion = (response) => {
            const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
            PrinJs(url);
        };
        dispatch(actions.printFacturaPagoParqueadero(id, {callback: callback_impresion}));
    };

    const onPagar = () => {
        const {modalidad_fraccion_tiempo_id} = info_pago;
        const cargarRegistro = () => {
            dispatch(
                actions.fetchRegistroEntradaParqueo(vehiculo_parqueadero_seleccionado, {
                    callback: () => {
                        setInfoPago(null);
                        setVehiculoParqueaderoSeleccionado(null);
                        setCajaDialogOpen(false);
                        cargarDatos();
                    }
                })
            )
        };
        dispatch(actions.pagarRegistroEntradaParqueo(vehiculo_parqueadero_seleccionado, modalidad_fraccion_tiempo_id, {callback: cargarRegistro}));
    };

    const getValorAPagar = (id) => {
        dispatch(actions.valorAPagarRegistroEntradaParqueo(id, {callback: (res) => setInfoPago(res)}))
    };

    const onRegistrarSalida = () => {
        const cargarRegistro = () => {
            dispatch(
                actions.fetchRegistroEntradaParqueo(vehiculo_parqueadero_seleccionado, {
                    callback: () => {
                        setVehiculoParqueaderoSeleccionado(null);
                        setSalidaDialogOpen(false);
                        cargarDatos();
                    }
                })
            )
        };
        dispatch(actions.registrarSalidaRegistroEntradaParqueo(vehiculo_parqueadero_seleccionado, {callback: cargarRegistro}));
    };

    const onSelectVehiculoParqueadero = (id) => {
        const callback = (res) => {
            if (!res.hora_salida && res.hora_pago) {
                setSalidaDialogOpen(true);
                setVehiculoParqueaderoSeleccionado(id);
            }
            if (!res.hora_salida && !res.hora_pago) {
                getValorAPagar(id);
                setCajaDialogOpen(true);
                setVehiculoParqueaderoSeleccionado(id);
            }
            if (!res.hora_salida || !res.hora_pago) {
                setVehiculoParqueaderoSeleccionado(id);
            }
        };
        dispatch(actions.fetchRegistroEntradaParqueo(id, {callback}))
    };


    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearRegistrosEntradasParqueos());
            dispatch(actions.clearTiposVehiculos());
            dispatch(actions.clearModalidadesFraccionesTiempos());
            dispatch(actions.clearModalidadesFraccionesTiemposDetalles());
        };
    }, []);

    useInterval(() => {
        if (
            !entrada_dialog_open &&
            !caja_dialog_open &&
            !salida_dialog_open
        ) {
            dispatch(actions.fetchRegistrosEntradasParqueos_por_salir({
                show_cargando: false,
                limpiar_coleccion: false
            }));
        }
    }, 5000);

    useInterval(() => {
        setActualTime(new Date())
    }, 1000);

    let por_grupos = _.countBy(registros_entradas_parqueos, 'tipo_vehiculo_nombre');
    let por_grupo_array = [];
    _.mapKeys(por_grupos, (cantidad, tipo) =>
        por_grupo_array = [...por_grupo_array, {cantidad: cantidad, tipo: tipo}]
    );

    let pendiente_por_salir = _.pickBy(registros_entradas_parqueos, e => (e.hora_pago && !e.hora_salida));
    let en_proceso = _.pickBy(registros_entradas_parqueos, e => (!e.hora_pago && !e.hora_salida));
    if (busqueda !== '') {
        pendiente_por_salir = _.pickBy(pendiente_por_salir, e => {
            return (
                e.vehiculo_placa.toLowerCase().includes(busqueda.toLowerCase()) ||
                e.tipo_vehiculo_nombre.toLowerCase().includes(busqueda.toLowerCase())
            )
        });
        en_proceso = _.pickBy(en_proceso, e => {
            return (
                e.vehiculo_placa.toLowerCase().includes(busqueda.toLowerCase()) ||
                e.tipo_vehiculo_nombre.toLowerCase().includes(busqueda.toLowerCase())
            )
        })
    }

    return (
        <div className='row' style={{marginTop: '-30px'}}>
            {entrada_dialog_open &&
            <EntradaParqueaderoDialog
                is_open={true}
                onCerrar={() => {
                    setEntradaDialogOpen(false);
                    setInfoPago(null);
                    setVehiculoParqueaderoSeleccionado(null);
                }}
            />}
            {caja_dialog_open &&
            <CajaParqueaderoDialog
                is_open={true}
                info_pago={info_pago}
                vehiculo={registros_entradas_parqueos[vehiculo_parqueadero_seleccionado]}
                onCerrar={() => {
                    setCajaDialogOpen(false);
                    setInfoPago(null);
                    setVehiculoParqueaderoSeleccionado(null);
                }}
                onPagar={onPagar}
            />}
            {salida_dialog_open &&
            <SalidaParqueaderoDialog
                is_open={true}
                onRegistrarSalida={onRegistrarSalida}
                vehiculo={registros_entradas_parqueos[vehiculo_parqueadero_seleccionado]}
                onCerrar={() => {
                    setSalidaDialogOpen(false);
                    setInfoPago(null);
                    setVehiculoParqueaderoSeleccionado(null);
                }}
            />}
            <div className="col-12">
                <div className="row">
                    <div className="col-12 col-md-4">
                        <FontAwesomeIcon
                            className='puntero'
                            icon={['far', 'plus-circle']}
                            size='4x'
                            onClick={() => setEntradaDialogOpen(true)}
                        />
                    </div>
                    <div className="col-12 col-md-8">
                        <input id="busqueda" className="form-control" type="text"
                               value={busqueda}
                               placeholder="Placa a buscar..."
                               onChange={event => setBusqueda(event.target.value)}/>
                    </div>
                </div>
            </div>
            {
                _.size(pendiente_por_salir) > 0 &&
                <div className="col-12 mt-2">
                    <Badge color="secondary" badgeContent={_.size(pendiente_por_salir)}>
                        <Typography variant="h5" color="primary" noWrap>
                            Pendientes por salir
                        </Typography>
                    </Badge>
                    <VehiculoParqueaderoListado
                        onSelectVehiculoParqueadero={onSelectVehiculoParqueadero}
                        listado_vehiculos={pendiente_por_salir}
                        actual_time={actual_time}
                        onImprimir={onImprimirFactura}
                    />
                </div>
            }
            {
                _.size(en_proceso) > 0 &&
                <div className="col-12 mt-2">
                    <Badge color="secondary" badgeContent={_.size(en_proceso)}>
                        <Typography variant="h5" color="primary" noWrap>
                            En Proceso
                        </Typography>
                    </Badge>
                    <VehiculoParqueaderoListado
                        onImprimir={onImprimirComprobante}
                        onSelectVehiculoParqueadero={onSelectVehiculoParqueadero}
                        listado_vehiculos={en_proceso}
                        actual_time={actual_time}
                    />
                </div>
            }
            <div className="col12">
                <Typography variant="h5" color="primary" noWrap>
                    Resumen
                </Typography>
                <table
                    style={styles.table}
                    className='table table-striped table-responsive'
                >
                    <tbody>
                    {por_grupo_array.map(e =>
                        <tr key={e.tipo}
                            style={styles.table.tr}
                        >
                            <td style={styles.table.td}>{e.tipo}</td>
                            <td style={styles.table.td}>{e.cantidad}</td>
                        </tr>)}
                    </tbody>
                    <tfoot>
                    <tr style={styles.table.tr}>
                        <td style={styles.table.td}>Total</td>
                        <td style={styles.table.td}>{_.size(pendiente_por_salir) + _.size(en_proceso)}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
});

export default DashboardParqueadero;