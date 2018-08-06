import React, {Component} from 'react';
import CreateForm from './forms/movimiento_inventario_form';
import Tabla from './movimientos_inventarios_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';
import {fechaFormatoUno} from "../../../../../00_utilities/common";


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
        this.plural_name = 'Movimientos Inventarios';
        this.singular_name = 'Movimiento Inventario';
    }

    successSubmitCallback(item) {
        const nombre = `de ${fechaFormatoUno(item.fecha)} número ${item.id}`;
        const {notificarAction} = this.props;
        notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${this.singular_name.toLowerCase()} ${nombre}`);

    }


    successDeleteCallback(item) {
        const nombre = `de ${fechaFormatoUno(item.fecha)} número ${item.id}`;
        const {notificarAction} = this.props;
        notificarAction(`Se ha eliminado con éxito ${this.singular_name.toLowerCase()} ${nombre}`);

    }

    fetchObjectMethod(item_id, successCallback) {

        const success_method = (item) => {
            successCallback(item);

        };

        this.props.fetchMovimientoInventario(item_id, success_method);
    }

    createObjectMethod(item, successCallback) {
        const callback = (response) => {
            this.successSubmitCallback(response);
            successCallback();
            this.props.history.push(`/app/admin/inventarios/movimientos_inventarios/detail/${response.id}`);
        };
        this.props.createMovimientoInventario(item, {callback});
    }

    updateObjectMethod(item, successCallback) {
        const callback = () => {
            this.successSubmitCallback(item);
            successCallback();
        };
        this.props.updateMovimientoInventario(item.id, item, {callback});
    }

    deleteObjectMethod(item, successCallback) {
        const callback = () => {
            this.successDeleteCallback(item);
            successCallback();
        };
        this.props.deleteMovimientoInventario(item.id, {callback});
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