import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {
    EMPRESAS as permisos_view
} from "../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../00_utilities/common";
import CreateForm from '../components/forms/empresa_form';
import Tabla from '../components/empresas_tabla';
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
        this.props.clearEmpresas();
    }

    cargarDatos() {
        this.props.fetchEmpresas();
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const permisos_object = permisosAdapter(mis_permisos, permisos_view);
        const method_pool = {
            fetchObjectMethod: this.props.fetchEmpresa,
            deleteObjectMethod: this.props.deleteEmpresa,
            createObjectMethod: this.props.createEmpresa,
            updateObjectMethod: this.props.updateEmpresa,
        };
        return (
            <Fragment>
                <CRUD
                    {...this.props}
                    method_pool={method_pool}
                    list={object_list}
                    permisos_object={permisos_object}
                    plural_name='Empresas'
                    singular_name='Empresa'
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
        object_list: state.empresas,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(List)