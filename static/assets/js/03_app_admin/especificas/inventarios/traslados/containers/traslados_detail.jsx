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
        this.props.clearTrasladosInventarios();
        this.props.clearTrasladosInventariosDetalles();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const {noCargando, cargando, notificarAction, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarTrasladoInventarioDetalles = this.props.fetchTrasladosInventariosDetallesxTralado(id, () => noCargando(), notificarErrorAjaxAction);
        const cargarTrasladoInventario = () => this.props.fetchTrasladoInventario(id, cargarTrasladoInventarioDetalles, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarTrasladoInventario, notificarErrorAjaxAction);

    }

    render() {
        const {object, mis_permisos, traslados_inventarios_detalles_list} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        console.log(traslados_inventarios_detalles_list);


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
    }
}

export default connect(mapPropsToState, actions)(Detail)