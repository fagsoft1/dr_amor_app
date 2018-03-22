import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto, AtributoTexto, AtributoBooleano} from "../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
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
        const {noCargando, cargando, notificarAction, notificarErrorAjaxAction} = this.props;
        cargando();
        const success_callback = () => {
            noCargando();
        };
        const cargarProductos = () => this.props.fetchProductos(success_callback, notificarErrorAjaxAction);
        const cargarMovimientoInventario = () => this.props.fetchMovimientoInventario(id, cargarProductos, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarMovimientoInventario, notificarErrorAjaxAction);

    }

    render() {
        const {object, mis_permisos} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);


        if (!object) {
            return <SinObjeto/>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de movimiento inventario'>
                <Titulo>Detalle {object.id}</Titulo>
                <div className="row">

                </div>

                <ListCrud
                    movimiento_inventario_object={object}
                    object_list={object.detalles}
                    permisos_object={permisos}
                    {...this.props}
                />

                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        object: state.movimientos_inventarios[id],
        productos_list: state.productos,
    }
}

export default connect(mapPropsToState, actions)(Detail)