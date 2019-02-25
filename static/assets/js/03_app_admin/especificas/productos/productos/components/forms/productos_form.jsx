import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCombobox} from '../../../../../../00_utilities/components/ui/forms/fields';
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
            empresas_list,
            categorias_dos_list,
            unidades_list,
        } = this.props;
        return (
            <MyFormTagModal
                fullScreen={false}
                onCancel={onCancel}
                onSubmit={handleSubmit(onSubmit)}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <MyTextFieldSimple
                    className="col-12 col-md-9"
                    nombre='Nombre'
                    name='nombre'
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12 col-md-3"
                    nombre='Precio de Venta'
                    name='precio_venta'
                />
                <MyCombobox
                    className="col-12 col-md-6"
                    nombre='Empresa'
                    name='empresa'
                    textField='nombre'
                    placeholder='Seleccionar Empresa'
                    valuesField='id'
                    data={_.map(empresas_list, h => {
                        return ({
                            id: h.id,
                            nombre: h.nombre
                        })
                    })}
                    filter='contains'
                />
                <MyCombobox
                    className="col-12 col-md-6"
                    nombre='Unidad'
                    name='unidad_producto'
                    textField='nombre'
                    placeholder='Seleccionar Unidad'
                    valuesField='id'
                    data={_.map(unidades_list, h => {
                        return ({
                            id: h.id,
                            nombre: h.nombre
                        })
                    })}
                    filter='contains'
                />
                <MyCombobox
                    className="col-12 col-md-12"
                    nombre='Categoria'
                    name='categoria_dos'
                    textField='nombre'
                    placeholder='Seleccionar Categoria'
                    valuesField='id'
                    data={_.map(categorias_dos_list, h => {
                        return ({
                            id: h.id,
                            nombre: `${h.nombre} - ${h.categoria_nombre}`
                        })
                    })}
                    filter='contains'
                />
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
    form: "productosForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;