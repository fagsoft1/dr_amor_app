import React, {Component} from 'react';
import CreateForm from './forms/colaboradores_form';
import Tabla from './colaboradores_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud_dos';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchColaborador,
            deleteObjectMethod: this.props.deleteColaborador,
            createObjectMethod: this.props.createColaborador,
            updateObjectMethod: this.props.updateColaborador,
        };
        this.plural_name = 'Colaboradores';
        this.singular_name = 'Colaborador';
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