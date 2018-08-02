import React, {Component, Fragment} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox,
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


class Form extends Component {
    componentDidMount() {
        const {movimiento_inventario_object, notificarErrorAction,} = this.props;
        if (movimiento_inventario_object.motivo === 'saldo_inicial') {
            this.props.fetchProductosParaSaldoInicial(null, notificarErrorAction);
        }
    }

    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            onSubmit,
            onCancel,
            handleSubmit,
            modal_open,
            singular_name,
            movimiento_inventario_object,
            productos_list
        } = this.props;
        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit((v) => onSubmit({...v, movimiento: movimiento_inventario_object.id}))}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >

                <MyCombobox
                    className="col-12"
                    nombre='Producto'
                    name='producto'
                    textField='nombre'
                    placeholder='Seleccionar Producto'
                    valuesField='id'
                    data={_.map(productos_list, h => {
                        return ({
                            id: h.id,
                            nombre: h.nombre
                        })
                    })}
                />

                {
                    (movimiento_inventario_object.tipo === 'E' || movimiento_inventario_object.tipo === 'EA') &&
                    <Fragment>
                        <MyTextFieldSimple
                            nombre='Cantidad de Ingreso'
                            className='col-12'
                            name='entra_cantidad'
                        />
                        {
                            movimiento_inventario_object.tipo === 'E' &&
                            < MyTextFieldSimple
                                nombre='Costo'
                                className='col-12'
                                name='entra_costo'
                            />
                        }
                    </Fragment>
                }
                {
                    (movimiento_inventario_object.tipo === 'S' || movimiento_inventario_object.tipo === 'SA') &&
                    <Fragment>
                        <MyTextFieldSimple
                            nombre='Cantidad de Salida'
                            className='col-12'
                            name='sale_cantidad'
                        />
                        {
                            movimiento_inventario_object.tipo === 'S' &&
                            < MyTextFieldSimple
                                nombre='Costo'
                                className='col-12'
                                name='sale_costo'
                            />
                        }
                    </Fragment>
                }

            </MyFormTagModal>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        initialValues: item_seleccionado
    }
}

Form = reduxForm({
    form: "movimientosInventariosForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;