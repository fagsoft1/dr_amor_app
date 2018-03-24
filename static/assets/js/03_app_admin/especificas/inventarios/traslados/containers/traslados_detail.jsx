import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto, AtributoTexto, AtributoBooleano} from "../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
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
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearPermisos();
        this.props.clearTrasladosInventarios();
        this.props.clearTrasladosInventariosDetalles();
    }

    updateCantidadTraslado(item) {
        const {noCargando, cargando, notificarAction, notificarErrorAjaxAction} = this.props;
        cargando();
        this.props.updateTrasladoInventarioDetalle(item.id, item, () => noCargando(), notificarErrorAjaxAction)
    }

    addItemTraslado(item) {
        const {noCargando, cargando, notificarAction, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarTrasladoDetalle = (response) => this.props.fetchTrasladoInventarioDetalle(response.id, () => noCargando(), notificarErrorAjaxAction)
        this.props.createTrasladoInventarioDetalle(item, cargarTrasladoDetalle, notificarErrorAjaxAction)
    }

    eliminarItem(item_id) {
        const {noCargando, cargando, notificarAction, notificarErrorAjaxAction} = this.props;
        this.props.deleteTrasladoInventarioDetalle(item_id, () => noCargando(), notificarErrorAjaxAction)
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        let bodega_origen_id = null;
        const {noCargando, cargando, notificarAction, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarInventarioBodegaOrigen = () => this.props.fetchMovimientosInventariosSaldosxBodega(bodega_origen_id, () => noCargando(), notificarErrorAjaxAction);
        const cargarTrasladoInventarioDetalles = () => this.props.fetchTrasladosInventariosDetallesxTralado(id, cargarInventarioBodegaOrigen, notificarErrorAjaxAction);
        const cargarTrasladoInventario = () => this.props.fetchTrasladoInventario(id, (e) => {
                cargarTrasladoInventarioDetalles(e);
                bodega_origen_id = e.bodega_origen;
            },
            notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarTrasladoInventario, notificarErrorAjaxAction);

    }

    render() {
        const {object, mis_permisos, traslados_inventarios_detalles_list, inventarios_bodega_origen_list} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);

        if (!object) {
            return <SinObjeto/>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de algo'>
                <Titulo>Detalle {object.username}</Titulo>
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
                        const {noCargando, cargando, notificarErrorAjaxAction, trasladarTrasladoInventario} = this.props;
                        cargando();
                        const cargarDetalles = () => this.props.fetchTrasladosInventariosDetallesxTralado(object.id, () => noCargando(), notificarErrorAjaxAction);
                        trasladarTrasladoInventario(object.id, cargarDetalles, notificarErrorAjaxAction);
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
        mis_permisos: state.mis_permisos,
        object: state.traslados_inventarios[id],
        traslados_inventarios_detalles_list: state.traslados_inventarios_detalles,
        inventarios_bodega_origen_list: state.movimientos_inventarios_detalles,
    }
}

export default connect(mapPropsToState, actions)(Detail)