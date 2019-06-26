import React, {Component, Fragment} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox,
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


class Form extends Component {
    componentDidMount() {
        const {movimiento_inventario_object} = this.props;
        if (movimiento_inventario_object.motivo === 'saldo_inicial') {
            this.props.fetchProductosParaSaldoInicial();
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
            productos_list,
            error,
            object
        } = this.props;
        return (
            <MyFormTagModal
                fullScreen={false}
                onCancel={onCancel}
                onSubmit={handleSubmit((v) => onSubmit({...v, movimiento: movimiento_inventario_object.id}))}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
                error={error}
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
                    filter='contains'
                />

                {
                    (movimiento_inventario_object.tipo === 'E') &&
                    <Fragment>
                        <MyTextFieldSimple
                            nombre='Cantidad de Ingreso'
                            className='col-5 col-md-2'
                            name='entra_cantidad'
                        />
                        < MyTextFieldSimple
                            nombre='Costo'
                            className='col-7 col-md-10'
                            name='entra_costo'
                        />
                    </Fragment>
                }
                {
                    (movimiento_inventario_object.tipo === 'S') &&
                    <Fragment>
                        <MyTextFieldSimple
                            nombre='Cantidad de Salida'
                            className='col-12'
                            name='sale_cantidad'
                        />
                    </Fragment>
                }

            </MyFormTagModal>
        )
    }
}

Form = reduxForm({
    form: "movimientosInventariosForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;