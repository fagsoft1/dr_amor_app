import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {
    COLABORADORES as permisos_view
} from "../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../00_utilities/common";

import CreateForm from '../components/forms/colaboradores_form';
import Tabla from '../components/colaboradores_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearColaboradores();
    }

    cargarDatos() {
        this.props.fetchColaboradores();
    }

    render() {
        const {object_list} = this.props;
        const permisos_object = permisosAdapter(permisos_view);
        const method_pool = {
            fetchObjectMethod: this.props.fetchColaborador,
            deleteObjectMethod: this.props.deleteColaborador,
            createObjectMethod: this.props.createColaborador,
            updateObjectMethod: this.props.updateColaborador,
        };
        return (
            <Fragment>
                <CRUD
                    method_pool={method_pool}
                    list={object_list}
                    permisos_object={permisos_object}
                    plural_name='Colaboradores'
                    singular_name='Colaborador'
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
        object_list: state.colaboradores
    }
}

export default connect(mapPropsToState, actions)(List)