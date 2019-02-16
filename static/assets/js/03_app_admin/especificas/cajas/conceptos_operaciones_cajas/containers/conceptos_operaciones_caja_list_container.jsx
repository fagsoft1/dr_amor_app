import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {
    CONCEPTOS_OPERACIONES_CAJA as permisos_view
} from "../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../00_utilities/common";

import CreateForm from '../components/forms/concepto_operacion_caja_form';
import Tabla from '../components/conceptos_operaciones_caja_tabla';
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
        this.props.clearConceptosOperacionesCajas();
    }

    cargarDatos() {
        this.props.fetchConceptosOperacionesCajas();
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        const method_pool = {
            fetchObjectMethod: this.props.fetchConceptoOperacionCaja,
            deleteObjectMethod: this.props.deleteConceptoOperacionCaja,
            createObjectMethod: this.props.createConceptoOperacionCaja,
            updateObjectMethod: this.props.updateConceptoOperacionCaja,
        };
        return (
            <Fragment>
                <CRUD
                    method_pool={method_pool}
                    list={object_list}
                    permisos_object={permisos}
                    plural_name='Conceptos Operaciones Cajas'
                    singular_name='Concepto Operación Caja'
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
        mis_permisos: state.mis_permisos,
        object_list: state.conceptos_operaciones_caja
    }
}

export default connect(mapPropsToState, actions)(List)