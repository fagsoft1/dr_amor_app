import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
import Typography from '@material-ui/core/Typography';
import {
    TRASLADOS_INVENTARIOS as permisos_view
} from "../../../../../00_utilities/permisos/types";
import Combobox from 'react-widgets/lib/Combobox';

import TablaDetalleProceso from '../components/traslados_detalles_tabla';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.updateCantidadTraslado = this.updateCantidadTraslado.bind(this);
        this.eliminarItem = this.eliminarItem.bind(this);
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view], {callback: () => this.cargarDatos()});
    }

    componentWillUnmount() {
        this.props.clearPermisos();
        this.props.clearTrasladosInventarios();
        this.props.clearTrasladosInventariosDetalles();
    }

    updateCantidadTraslado(item) {
        this.props.updateTrasladoInventarioDetalle(item.id, item)
    }

    addItemTraslado(item) {
        const cargarTrasladoDetalle = (response) => this.props.fetchTrasladoInventarioDetalle(response.id);
        this.props.createTrasladoInventarioDetalle(item, {callback: cargarTrasladoDetalle})
    }

    eliminarItem(item_id) {
        this.props.deleteTrasladoInventarioDetalle(item_id)
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        let bodega_origen_id = null;
        const cargarInventarioBodegaOrigen = () => this.props.fetchMovimientosInventariosSaldosxBodega(bodega_origen_id);
        const cargarTrasladoInventarioDetalles = () => this.props.fetchTrasladosInventariosDetallesxTralado(id, {callback: cargarInventarioBodegaOrigen});
        this.props.fetchTrasladoInventario(id, {
                callback: (e) => {
                    cargarTrasladoInventarioDetalles(e);
                    bodega_origen_id = e.bodega_origen;
                }
            }
        );

    }

    render() {
        const {
            object,
            traslados_inventarios_detalles_list,
            inventarios_bodega_origen_list,
            mis_permisos
        } = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);

        if (!object) {
            return <Typography variant="overline" gutterBottom color="primary">
                Cargando...
            </Typography>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de algo'>
                <Typography variant="h5" gutterBottom color="primary">
                    Detalle {object.username}
                </Typography>
                <div className="row">
                    <div className="col-12"><strong>Bodega Origen: </strong>{object.bodega_origen_nombre}</div>
                    <div className="col-12"><strong>Bodega Destino: </strong>{object.bodega_destino_nombre}</div>
                </div>
                {
                    !object.trasladado &&
                    <div className="col-12 mt-3 mb-3">
                        <Combobox
                            data={_.map(inventarios_bodega_origen_list, e => {
                                return ({...e, text: `${e.producto_nombre} - ${e.saldo_cantidad}`})
                            })}
                            placeholder='Producto a adicionar'
                            valueField='producto'
                            textField='text'
                            onSelect={(e) => {
                                this.addItemTraslado(
                                    {traslado: object.id, producto: e.producto, cantidad: 0}
                                )
                            }}
                        />
                    </div>
                }
                <TablaDetalleProceso
                    traslado={object}
                    updateCantidadTraslado={this.updateCantidadTraslado}
                    eliminarItem={this.eliminarItem}
                    traslados={traslados_inventarios_detalles_list}
                />
                {
                    !object.trasladado &&
                    <span className='btn btn-primary' onClick={() => {
                        const {trasladarTrasladoInventario} = this.props;

                        const cargarDetalles = () => this.props.fetchTrasladosInventariosDetallesxTralado(object.id);
                        trasladarTrasladoInventario(object.id, cargarDetalles);
                    }}>
                    Trasladar
                </span>
                }
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        auth: state.auth,
        mis_permisos: state.mis_permisos,
        object: state.traslados_inventarios[id],
        traslados_inventarios_detalles_list: state.traslados_inventarios_detalles,
        inventarios_bodega_origen_list: state.movimientos_inventarios_detalles,
    }
}

export default connect(mapPropsToState, actions)(Detail)