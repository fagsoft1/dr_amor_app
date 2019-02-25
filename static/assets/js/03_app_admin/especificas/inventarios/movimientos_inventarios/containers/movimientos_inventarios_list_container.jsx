import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {
    MOVIMIENTOS_INVENTARIOS as permisos_view
} from "../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../00_utilities/common";
import crudHOC from '../../../../../00_utilities/components/hoc_crud';

import CreateForm from '../components/forms/movimiento_inventario_form';
import Tabla from '../components/movimientos_inventarios_tabla';

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
        this.props.clearMovimientosInventarios();
        this.props.clearBodegas();
        this.props.clearProveedores();
    }

    cargarDatos() {
        const cargarBodegas = () => this.props.fetchBodegas();
        const cargarProveedores = () => this.props.fetchProveedores({callback: cargarBodegas});
        this.props.fetchMovimientosInventarios({callback: cargarProveedores});

    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const permisos_object = permisosAdapter(mis_permisos, permisos_view);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchMovimientoInventario,
            deleteObjectMethod: this.props.deleteMovimientoInventario,
            createObjectMethod: this.props.createMovimientoInventario,
            updateObjectMethod: this.props.updateMovimientoInventario,
        };
        return (
            <Fragment>
                <CRUD
                    posCreateMethod={(res) => this.props.history.push(`/app/admin/inventarios/movimientos_inventarios/detail/${res.id}`)}
                    method_pool={this.method_pool}
                    list={object_list}
                    permisos_object={permisos_object}
                    plural_name='Movimientos Inventarios'
                    singular_name='Movimiento Inventario'
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
        object_list: _.orderBy(state.movimientos_inventarios, ['fecha'], ['asc']),
        proveedores_list: state.proveedores,
        bodegas_list: state.bodegas,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(List)