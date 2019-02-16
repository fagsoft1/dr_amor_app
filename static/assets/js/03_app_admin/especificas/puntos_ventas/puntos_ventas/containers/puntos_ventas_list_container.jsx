import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {
    PUNTOS_VENTAS as permisos_view
} from "../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../00_utilities/common";
import crudHOC from '../../../../../00_utilities/components/hoc_crud';
import CreateForm from '../components/forms/punto_venta_form';
import Tabla from '../components/puntos_ventas_tabla';

const CRUD = crudHOC(CreateForm, Tabla);


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view], {callback: () => this.cargarDatos()});
    }

    componentWillUnmount() {
        this.props.clearPuntosVentas();
        this.props.clearBodegas();
    }

    cargarDatos() {
        this.props.fetchPuntosVentas();
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const permisos_object = permisosAdapter(mis_permisos, permisos_view);
        const method_pool = {
            fetchObjectMethod: this.props.fetchPuntoVenta,
            deleteObjectMethod: this.props.deletePuntoVenta,
            createObjectMethod: this.props.createPuntoVenta,
            updateObjectMethod: this.props.updatePuntoVenta,
        };
        return (
            <Fragment>
                <CRUD
                    method_pool={method_pool}
                    list={object_list}
                    permisos_object={permisos_object}
                    plural_name='Puntos de Ventas'
                    singular_name='Punto Venta'
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
        object_list: state.puntos_ventas,
        mis_permisos: state.mis_permisos,
        bodegas_list: state.bodegas,
    }
}

export default connect(mapPropsToState, actions)(List)