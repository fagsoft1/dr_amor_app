import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto, AtributoTexto, AtributoBooleano} from "../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter, numerosFormato} from "../../../../../00_utilities/common";
import {
    MOVIMIENTOS_INVENTARIOS as permisos_view
} from "../../../../../00_utilities/permisos/types";

import ListCrud from '../../movimientos_inventarios_detalles/components/movimientos_inventarios_detalles_list';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearPermisos();
        this.props.clearMovimientosInventarios();
        this.props.clearMovimientosInventariosDetalles();
        this.props.clearProductos();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const {noCargando, cargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const success_callback = (movimiento) => {
            if (!movimiento.cargado) {
                this.props.clearProductos();
                if (movimiento.motivo === 'saldo_inicial') {
                    this.props.fetchProductosParaSaldoInicial(() => noCargando(), notificarErrorAjaxAction);
                } else {
                    this.props.fetchProductos(() => noCargando(), notificarErrorAjaxAction);
                }
            }
            noCargando();
        };
        const cargarMovimientoInventario = () => this.props.fetchMovimientoInventario(id, success_callback, notificarErrorAjaxAction);
        const cargarDetalles = () => this.props.fetchMovimientosInventariosDetallesxMovimiento(id, cargarMovimientoInventario, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarDetalles, notificarErrorAjaxAction);

    }

    render() {
        const {object, mis_permisos, movimientos_inventarios_detalles_list} = this.props;
        const {id} = this.props.match.params;
        const permisos = permisosAdapter(mis_permisos, permisos_view);


        if (!object) {
            return <SinObjeto/>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de movimiento inventario'>
                <Titulo>Detalle</Titulo>
                <div className="row">
                    <div className="col-12"><strong>Bodega: </strong>{object.bodega_nombre}</div>
                    <div className="col-12"><strong>Proveedor: </strong>{object.proveedor_nombre}</div>
                </div>

                <ListCrud
                    movimiento={object}
                    movimiento_inventario_object={object}
                    object_list={_.map(movimientos_inventarios_detalles_list, e => e)}
                    permisos_object={{
                        ...permisos,
                        add: (permisos.add && !object.cargado),
                        delete: (permisos.delete && !object.cargado),
                        change: (permisos.change && !object.cargado),
                    }}
                    {...this.props}
                />

                <CargarDatos cargarDatos={this.cargarDatos}/>
                {
                    !object.cargado &&
                    _.size(movimientos_inventarios_detalles_list) > 0 &&
                    <span className='btn btn-primary' onClick={() => {
                        const {noCargando, cargando, notificarErrorAjaxAction, cargarInventarioMovimientoInventario} = this.props;
                        cargando();
                        const cargarDetalles = () => this.props.fetchMovimientosInventariosDetallesxMovimiento(id, () => noCargando(), notificarErrorAjaxAction);
                        cargarInventarioMovimientoInventario(id, cargarDetalles, notificarErrorAjaxAction);
                    }}>
                    Cargar Inventario
                </span>
                }
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        movimientos_inventarios_detalles_list: state.movimientos_inventarios_detalles,
        object: state.movimientos_inventarios[id],
        productos_list: state.productos,
    }
}

export default connect(mapPropsToState, actions)(Detail)