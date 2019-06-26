import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/CargarDatos";
import {
    BILLETES_MONEDAS as permisos_view
} from "../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../00_utilities/common";

import CreateForm from '../components/forms/billetes_monedas_form';
import Tabla from '../components/billetes_monedas_tabla';
import crudHOC from '../../../../../00_utilities/components/HOCCrud';

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
        this.props.clearBilletesMonedas();
    }

    cargarDatos() {
        this.props.fetchBilletesMonedas();
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const permisos_object = permisosAdapter(mis_permisos, permisos_view);
        const method_pool = {
            fetchObjectMethod: this.props.fetchBilleteMoneda,
            deleteObjectMethod: this.props.deleteBilleteMoneda,
            createObjectMethod: this.props.createBilleteMoneda,
            updateObjectMethod: this.props.updateBilleteMoneda,
        };
        return (
            <Fragment>
                <CRUD
                    {...this.props}
                    method_pool={method_pool}
                    list={object_list}
                    permisos_object={permisos_object}
                    plural_name='Billetes y Monedas'
                    singular_name='Billete Moneda'
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
        mis_permisos: state.mis_permisos,
        object_list: state.billetes_monedas
    }
}

export default connect(mapPropsToState, actions)(List)