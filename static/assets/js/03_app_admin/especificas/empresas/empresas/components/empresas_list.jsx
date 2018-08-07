import React, {Component} from 'react';
import CreateForm from './forms/empresa_form';
import Tabla from './empresas_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud_dos';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchEmpresa,
            deleteObjectMethod: this.props.deleteEmpresa,
            createObjectMethod: this.props.createEmpresa,
            updateObjectMethod: this.props.updateEmpresa,
        };
        this.plural_name = 'Empresas';
        this.singular_name = 'Empresa';
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