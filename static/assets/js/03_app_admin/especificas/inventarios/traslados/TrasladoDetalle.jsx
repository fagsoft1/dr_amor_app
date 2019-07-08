import React, {Fragment, memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import Typography from '@material-ui/core/Typography/index';
import Button from '@material-ui/core/Button/index';
import {TRASLADOS_INVENTARIOS} from "../../../../permisos";
import Combobox from 'react-widgets/lib/Combobox';

import TablaDetalleProceso from './TrasladoDetalleTabla';
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";

const Detail = memo(props => {
    const {id} = props.match.params;
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(TRASLADOS_INVENTARIOS);
    const traslado = useSelector(state => state.traslados_inventarios[id]);
    const traslados_inventarios_detalles = useSelector(state => state.traslados_inventarios_detalles);
    const movimientos_inventarios_detalles = useSelector(state => state.movimientos_inventarios_detalles);

    const updateCantidadTraslado = (item) => {
        dispatch(actions.updateTrasladoInventarioDetalle(item.id, item));
    };

    const addItemTraslado = (item) => {
        const cargarTrasladoDetalle = (response) => dispatch(actions.fetchTrasladoInventarioDetalle(response.id));
        dispatch(actions.createTrasladoInventarioDetalle(item, {callback: cargarTrasladoDetalle}));
    };

    const eliminarItem = (item_id) => {
        dispatch(actions.deleteTrasladoInventarioDetalle(item_id));
    };

    const cambiarEstadoTrasladoInventario = (nuevo_estado) => {
        dispatch(actions.cambiarEstadoTrasladoInventario(id, nuevo_estado));
    };

    const productos_ya_cargados_id = _.map(traslados_inventarios_detalles, e => e.producto);
    const inventario_disponible_para_trasladar = _.pickBy(movimientos_inventarios_detalles, e => !productos_ya_cargados_id.includes(e.producto));
    const cargarDatos = () => {
        let bodega_origen_id = null;
        const cargarInventarioBodegaOrigen = () => dispatch(actions.fetchMovimientosInventariosDetallesSaldosxBodega(bodega_origen_id));
        const cargarTrasladoInventarioDetalles = () => dispatch(actions.fetchTrasladosInventariosDetallesxTralado(id, {callback: cargarInventarioBodegaOrigen}));
        dispatch(actions.fetchTrasladoInventario(id, {
                callback: (e) => {
                    cargarTrasladoInventarioDetalles(e);
                    bodega_origen_id = e.bodega_origen;
                }
            }
        ));

    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearTrasladosInventarios());
            dispatch(actions.clearTrasladosInventariosDetalles());
        };
    }, []);

    if (!traslado) {
        return <Typography variant="overline" gutterBottom color="primary">
            Cargando...
        </Typography>
    }
    const editable = traslado.estado === 1;
    return (
        <Fragment>
            <Typography variant="h5" gutterBottom color="primary">
                Detalle {traslado.username}
            </Typography>
            <div className="row">
                <div className="col-12"><strong>Bodega Origen: </strong>{traslado.bodega_origen_nombre}</div>
                <div className="col-12"><strong>Bodega Destino: </strong>{traslado.bodega_destino_nombre}</div>
            </div>
            {
                editable &&
                <div className="col-12 mt-3 mb-3">
                    <Combobox
                        data={_.map(inventario_disponible_para_trasladar, e => {
                            return ({...e, text: `${e.producto_nombre} - ${e.saldo_cantidad}`})
                        })}
                        placeholder='Producto a adicionar'
                        valueField='producto'
                        textField='text'
                        onSelect={(e) => {
                            addItemTraslado(
                                {traslado: traslado.id, producto: e.producto, cantidad: 0}
                            )
                        }}
                        filter='contains'
                    />
                </div>
            }
            <TablaDetalleProceso
                editable={editable}
                traslado={traslado}
                updateCantidadTraslado={updateCantidadTraslado}
                eliminarItem={eliminarItem}
                traslados={traslados_inventarios_detalles}
            />
            {
                traslado.estado === 1 &&
                <Button
                    color='primary'
                    variant="contained"
                    onClick={() => {
                        cambiarEstadoTrasladoInventario(2)
                    }}
                >
                    Solicitar Recibir Traslado
                </Button>
            }
            {
                traslado.estado === 2 &&
                <Button
                    color='primary'
                    variant="contained"
                    onClick={() => {
                        cambiarEstadoTrasladoInventario(1)
                    }}
                >
                    Editar
                </Button>
            }
            {
                traslado.estado === 2 &&
                <Button
                    color='primary'
                    variant="contained"
                    onClick={() => {
                        const cargarDetalles = () => dispatch(actions.fetchTrasladosInventariosDetallesxTralado(traslado.id));
                        dispatch(actions.trasladarTrasladoInventario(traslado.id, {callback: cargarDetalles}));
                    }}
                >
                    Trasladar
                </Button>
            }
            <CargarDatos cargarDatos={cargarDatos}/>
        </Fragment>
    )

});
export default Detail;