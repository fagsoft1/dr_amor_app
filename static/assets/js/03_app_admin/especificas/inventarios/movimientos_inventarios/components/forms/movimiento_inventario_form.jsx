import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox,
    MyDateTimePickerField,
    MyDropdownList
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


class Form extends Component {
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
            proveedores_list,
            bodegas_list,
        } = this.props;
        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit(onSubmit)}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <MyCombobox
                    className="col-12 col-md-6"
                    nombre='Bodega'
                    name='bodega'
                    textField='nombre'
                    placeholder='Seleccionar Bodega'
                    valuesField='id'
                    data={_.map(_.pickBy(bodegas_list, e => e.es_principal), h => {
                        return ({
                            id: h.id,
                            nombre: h.nombre
                        })
                    })}
                />
                <MyCombobox
                    className="col-12 col-md-6"
                    nombre='Proveedor'
                    name='proveedor'
                    textField='nombre'
                    placeholder='Seleccionar Proveedor'
                    valuesField='id'
                    data={_.map(proveedores_list, h => {
                        return ({
                            id: h.id,
                            nombre: h.nombre
                        })
                    })}
                />
                <MyDropdownList
                    className="col-12 col-md-6"
                    nombre='Motivo'
                    name='motivo'
                    textField='motivo'
                    placeholder='Seleccionar Motivo'
                    valuesField='detalle'
                    data={[
                        {
                            motivo: 'Compra',
                            detalle: 'compra'
                        },
                        {
                            motivo: 'Saldo Inicial',
                            detalle: 'saldo_inicial'
                        },
                    ]}
                />

                <MyDateTimePickerField
                    nombre='Fecha'
                    className='col-12 col-md-6'
                    name='fecha'
                />
                <div style={{height: '300px'}}>

                </div>
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