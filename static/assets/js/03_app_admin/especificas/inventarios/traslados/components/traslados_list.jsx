import React, {Component} from 'react';
import CreateForm from './forms/traslado_form';
import Tabla from './traslados_tabla';
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
        this.plural_name = 'Traslados Inventarios';
        this.singular_name = 'Traslado Inventario';
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

        this.props.fetchTrasladoInventario(item_id, success_method, notificarErrorAction);
    }

    createObjectMethod(item, successCallback) {
        const { notificarErrorAction} = this.props;
        const success_method = (response) => {
            this.successSubmitCallback(item);
            successCallback();
            this.props.history.push(`/app/admin/inventarios/traslados/detail/${response.id}`);
        };

        this.props.createTrasladoInventario(item, success_method, notificarErrorAction);
    }

    updateObjectMethod(item, successCallback) {
        const { notificarErrorAction} = this.props;
        const success_method = () => {
            this.successSubmitCallback(item);
            successCallback();
        };

        this.props.updateTrasladoInventario(item.id, item, success_method, notificarErrorAction);
    }

    deleteObjectMethod(item, successCallback) {
        const { notificarErrorAction} = this.props;
        const success_method = () => {
            this.successDeleteCallback(item);
            successCallback();
        };

        this.props.deleteTrasladoInventario(item.id, success_method, notificarErrorAction);
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