import React, {Component} from 'react';
import CreateForm from './forms/billetes_monedas_form';
import Tabla from './billetes_monedas_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud_dos';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchBilleteMoneda,
            deleteObjectMethod: this.props.deleteBilleteMoneda,
            createObjectMethod: this.props.createBilleteMoneda,
            updateObjectMethod: this.props.updateBilleteMoneda,
        };
        this.plural_name = 'Billetes Monedas';
        this.singular_name = 'Billete Moneda';
    }

    render() {
        const {object_list, permisos_object} = this.props;
        return (
            <CRUD
                method_pool={this.method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name={this.plural_name}
                singular_name={this.singular_name}
                {...this.props}
            />
        )
    }
}

export default List;