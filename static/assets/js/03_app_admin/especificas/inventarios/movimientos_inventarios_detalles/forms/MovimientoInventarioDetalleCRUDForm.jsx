import React, {Fragment, memo} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox,
} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


let Form = memo(props => {
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
        movimiento,
        error,
        productos
    } = props;

    return (
        <MyFormTagModal
            fullScreen={false}
            onCancel={onCancel}
            onSubmit={handleSubmit((v) => onSubmit({...v, movimiento: movimiento.id}))}
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
                label='Producto'
                label_space_xs={4}
                name='producto'
                textField='nombre'
                placeholder='Seleccionar Producto...'
                valuesField='id'
                data={_.map(productos, h => {
                    return ({
                        id: h.id,
                        nombre: h.nombre
                    })
                })}
                filter='contains'
            />

            {
                (movimiento.tipo === 'E') &&
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
                (movimiento.tipo === 'S') &&
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

});

Form = reduxForm({
    form: "movimientosInventariosForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;