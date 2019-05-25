import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {
    TRASLADOS_INVENTARIOS as permisos_view
} from "../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../00_utilities/common";
import CreateForm from '../components/forms/traslado_form';
import Tabla from '../components/traslados_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


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
        this.props.clearTrasladosInventarios();
        this.props.clearBodegas();
    }

    cargarDatos() {
        const cargarBodegas = () => this.props.fetchBodegas();
        this.props.fetchTrasladosInventarios({callback: cargarBodegas});

    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const permisos_object = permisosAdapter(mis_permisos, permisos_view);
        const method_pool = {
            fetchObjectMethod: this.props.fetchTrasladoInventario,
            deleteObjectMethod: this.props.deleteTrasladoInventario,
            createObjectMethod: this.props.createTrasladoInventario,
            updateObjectMethod: this.props.updateTrasladoInventario,
        };
        return (
            <Fragment>
                <CRUD
                    {...this.props}
                    method_pool={method_pool}
                    list={object_list}
                    posCreateMethod={(res) => this.props.history.push(`/app/admin/inventarios/traslados/detail/${res.id}`)}
                    permisos_object={permisos_object}
                    plural_name='Traslados Inventarios'
                    singular_name='Traslado Inventario'
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
        object_list: state.traslados_inventarios,
        bodegas_list: state.bodegas,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(List)