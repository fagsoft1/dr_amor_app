import React, {Component} from 'react';
import CreateForm from './forms/acompanantes_form';
import Tabla from './acompanantes_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.fetchObjectMethod.bind(this),
            deleteObjectMethod: this.deleteObjectMethod.bind(this),
            createObjectMethod: this.createObjectMethod.bind(this),
            updateObjectMethod: this.updateObjectMethod.bind(this),
        };
        this.plural_name = 'Acompañantes';
        this.singular_name = 'Acompañante';
    }

    successSubmitCallback(item) {
        const nombre = item.full_name_proxy;
        const {notificarAction} = this.props;
        notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${this.singular_name.toLowerCase()} ${nombre}`);
    }


    successDeleteCallback(item) {
        const nombre = item.full_name_proxy;
        const {notificarAction} = this.props;
        notificarAction(`Se ha eliminado con éxito ${this.singular_name.toLowerCase()} ${nombre}`);
    }

    fetchObjectMethod(item_id, successCallback) {

        const success_method = (item) => {
            successCallback(item);
        };
        this.props.fetchAcompanante(item_id, success_method);
    }

    createObjectMethod(item, successCallback) {
        const callback = (response) => {
            this.successSubmitCallback(response);
            successCallback();
        };
        this.props.createAcompanante(item, {callback});
    }

    updateObjectMethod(item, successCallback) {
        const callback = (acompanante) => {
            this.successSubmitCallback(acompanante);
            successCallback();
        };
        this.props.updateAcompanante(item.id, item, {callback});
    }

    deleteObjectMethod(item, successCallback) {

        const success_method = () => {
            this.successDeleteCallback(item);
            successCallback();
        };
        this.props.deleteAcompanante(item.id, success_method);
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