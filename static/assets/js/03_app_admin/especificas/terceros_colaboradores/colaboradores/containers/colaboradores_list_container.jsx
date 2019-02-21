import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {COLABORADORES as permisos_view} from "../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../00_utilities/common";

import CreateForm from '../components/forms/colaboradores_form';
import Tabla from '../components/colaboradores_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.uploadFotoPerfil = this.uploadFotoPerfil.bind(this);
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view], {callback: () => this.cargarDatos()});
    }

    componentWillUnmount() {
        this.props.clearColaboradores();
    }

    cargarDatos() {
        this.props.fetchColaboradores();
    }

    uploadFotoPerfil(id_colaborador, file) {
        let formData = new FormData();
        formData.append('archivo', file);
        this.props.uploadColaboradorFoto(id_colaborador, formData, {callback: () => this.props.fetchColaborador(id_colaborador)})
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const permisos_object = permisosAdapter(mis_permisos, permisos_view);
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
                    uploadFotoPerfil={this.uploadFotoPerfil.bind(this)}
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
        object_list: state.colaboradores,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(List)