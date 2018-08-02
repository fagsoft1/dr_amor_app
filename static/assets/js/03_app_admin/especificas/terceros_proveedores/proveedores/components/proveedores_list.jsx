import React, {Component} from 'react';
import CreateForm from './forms/proveedores_form';
import Tabla from './proveedores_tabla';
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
        this.plural_name = 'Proveedores';
        this.singular_name = 'Proveedor';
    }

    successSubmitCallback(item) {
        const nombre = item.nombre;
        const { notificarAction} = this.props;
        notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${this.singular_name.toLowerCase()} ${nombre}`);
        
    }


    successDeleteCallback(item) {
        const nombre = item.nombre;
        const { notificarAction} = this.props;
        notificarAction(`Se ha eliminado con éxito ${this.singular_name.toLowerCase()} ${nombre}`);
        
    }

    fetchObjectMethod(item_id, successCallback) {
        const {  notificarErrorAction} = this.props;
        const success_method = (item) => {
            successCallback(item);

        };
        
        this.props.fetchProveedor(item_id, success_method, notificarErrorAction);
    }

    createObjectMethod(item, successCallback) {
        const { notificarErrorAction} = this.props;
        const success_method = () => {
            this.successSubmitCallback(item);
            successCallback();
        };
        
        this.props.createProveedor(item, success_method, notificarErrorAction);
    }

    updateObjectMethod(item, successCallback) {
        const { notificarErrorAction} = this.props;
        const success_method = () => {
            this.successSubmitCallback(item);
            successCallback();
        };
        
        this.props.updateProveedor(item.id, item, success_method, notificarErrorAction);
    }

    deleteObjectMethod(item, successCallback) {
        const { notificarErrorAction} = this.props;
        const success_method = () => {
            this.successDeleteCallback(item);
            successCallback();
        };
        
        this.props.deleteProveedor(item.id, success_method, notificarErrorAction);
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