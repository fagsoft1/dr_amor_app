import React, {Component} from 'react';
import CreateForm from './forms/cuentas_contables_form';
import Tabla from './cuentas_contables_tabla';
import crudHOC from '../../../../../../00_utilities/components/HOCCrud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchCuentaContable,
            deleteObjectMethod: this.props.deleteCuentaContable,
            createObjectMethod: this.props.createCuentaContable,
            updateObjectMethod: this.props.updateCuentaContable,
        };
        this.plural_name = 'Cuentas Contables';
        this.singular_name = 'Cuenta Contable';
    }

    render() {
        const {object_list, permisos_object} = this.props;
        return (
            <CRUD
                {...this.props}
                method_pool={this.method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name={this.plural_name}
                singular_name={this.singular_name}
            />
        )
    }
}

export default List;