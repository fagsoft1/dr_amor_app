import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {
    MOVIMIENTOS_INVENTARIOS as permisos_view
} from "../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../00_utilities/common";

import ListCrud from '../components/movimientos_inventarios_list';


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearMovimientosInventarios();
        this.props.clearBodegas();
        this.props.clearProveedores();
    }

    cargarDatos() {
        const {  notificarErrorAjaxAction} = this.props;
        
        const cargarBodegas = () => this.props.fetchBodegas(null, notificarErrorAjaxAction);
        const cargarProveedores = () => this.props.fetchProveedores(cargarBodegas, notificarErrorAjaxAction);
        this.props.fetchMovimientosInventarios(cargarProveedores, notificarErrorAjaxAction);

    }

    render() {
        const {object_list, auth: {mis_permisos}} = this.props;
        const bloque_1_list = permisosAdapter( permisos_view);
        return (
            <Fragment>
                <ListCrud
                    object_list={object_list}
                    permisos_object={bloque_1_list}
                    {...this.props}
                />
                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </Fragment>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
        object_list: _.orderBy(state.movimientos_inventarios, ['fecha'], ['asc']),
        proveedores_list: state.proveedores,
        bodegas_list: state.bodegas,
    }
}

export default connect(mapPropsToState, actions)(List)