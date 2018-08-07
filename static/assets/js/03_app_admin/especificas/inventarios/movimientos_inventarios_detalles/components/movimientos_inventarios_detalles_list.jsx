import React, {Component} from 'react';
import CreateForm from './forms/movimiento_inventario_detalle_form';
import Tabla from './movimientos_inventarios_detalles_tabla';
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
        this.plural_name = 'Items';
        this.singular_name = 'Item';
    }

    successSubmitCallback(item) {
        const nombre = item.producto_nombre;
        const {notificarAction} = this.props;
        notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${this.singular_name.toLowerCase()} ${nombre}`);
        this.props.fetchMovimientoInventario(item.movimiento)
    }


    successDeleteCallback(item) {
        const nombre = item.producto_nombre;
        const {notificarAction} = this.props;
        notificarAction(`Se ha eliminado con éxito ${this.singular_name.toLowerCase()} ${nombre}`);
        this.props.fetchMovimientoInventario(item.movimiento)
    }

    fetchObjectMethod(item_id, callback) {
        this.props.fetchMovimientoInventarioDetalle(item_id, {callback});
    }

    createObjectMethod(item, successCallback) {
        const callback = (response) => {
            this.successSubmitCallback(response);
            successCallback();
        };
        this.props.createMovimientoInventarioDetalle(item, {callback});
    }

    updateObjectMethod(item, successCallback) {
        const callback = () => {
            this.successSubmitCallback(item);
            successCallback();
        };
        this.props.updateMovimientoInventarioDetalle(item.id, item, {callback});
    }

    deleteObjectMethod(item, successCallback) {
        const callback = () => {
            this.successDeleteCallback(item);
            successCallback();
        };
        this.props.deleteMovimientoInventarioDetalle(item.id, {callback});
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