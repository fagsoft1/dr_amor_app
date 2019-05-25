import React, {Component} from 'react';
import CreateForm from './forms/acompanantes_form';
import Tabla from './acompanantes_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchAcompanante,
            deleteObjectMethod: this.props.deleteAcompanante,
            createObjectMethod: this.props.createAcompanante,
            updateObjectMethod: this.props.updateAcompanante,
        };
        this.plural_name = 'Acompañantes';
        this.singular_name = 'Acompañante';
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