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


        const success_callback = (movimiento) => {
            if (!movimiento.cargado) {
                if (movimiento.motivo === 'saldo_inicial') {
                    this.props.fetchProductosParaSaldoInicial();
                } else {
                    this.props.fetchProductos();
                }
            }

        };
        const cargarMovimientoInventario = () => this.props.fetchMovimientoInventario(id, success_callback);
        this.props.fetchMovimientosInventariosDetallesxMovimiento(id, cargarMovimientoInventario);

    }

    render() {
        const {object, movimientos_inventarios_detalles_list} = this.props;
        const {id} = this.props.match.params;
        const permisos = permisosAdapter( permisos_view);


        if (!object) {
            return <SinObjeto/>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de movimiento inventario'>
                <Titulo>Detalle</Titulo>
                <div className="row">
                    <div className="col-12"><strong>Bodega: </strong>{object.bodega_nombre}</div>
                    {object.proveedor_nombre &&
                    <div className="col-12"><strong>Proveedor: </strong>{object.proveedor_nombre}</div>}
                    {object.observacion &&
                    <div className="col-12"><strong>Observación: </strong>{object.observacion}</div>}
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
                        const { cargarInventarioMovimientoInventario} = this.props;

                        const cargarDetalles = () => this.props.fetchMovimientosInventariosDetallesxMovimiento(id, null);
                        cargarInventarioMovimientoInventario(id, cargarDetalles);
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
        auth: state.auth,
        movimientos_inventarios_detalles_list: state.movimientos_inventarios_detalles,
        object: state.movimientos_inventarios[id],
        productos_list: state.productos,
    }
}

export default connect(mapPropsToState, actions)(Detail)