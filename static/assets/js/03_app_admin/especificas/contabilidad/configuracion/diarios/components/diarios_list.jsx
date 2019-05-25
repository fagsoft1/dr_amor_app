import React, {Component} from 'react';
import CreateForm from './forms/diarios_form';
import Tabla from './diarios_tabla';
import crudHOC from '../../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchDiarioContable,
            deleteObjectMethod: this.props.deleteDiarioContable,
            createObjectMethod: this.props.createDiarioContable,
            updateObjectMethod: this.props.updateDiarioContable,
        };
        this.plural_name = 'Impuestos';
        this.singular_name = 'Impuesto';
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