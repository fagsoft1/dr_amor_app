import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCombobox, MyDropdownList} from '../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


class Form extends Component {
    componentDidMount() {
        this.props.fetchBodegas();
    }

    componentWillUnmount() {
        this.props.clearBodegas();
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
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Nombre'
                    name='nombre'
                    case='U'/>

                <MyCombobox
                    className="col-12 col-md-6"
                    nombre='Bodega'
                    name='bodega'
                    textField='nombre'
                    placeholder='Seleccionar Bodega'
                    valuesField='id'
                    data={_.map(bodegas_list, h => {
                        return ({
                            id: h.id,
                            nombre: h.nombre
                        })
                    })}
                />

                <MyDropdownList
                    className="col-12 col-md-6"
                    data={[
                        {id: 1, nombre: 'Servicios'},
                        {id: 2, nombre: 'Tienda'},
                    ]}
                    textField='nombre'
                    name='tipo'
                    placeholder='Seleccionar Tipo Punto Venta'
                    valuesField='id'
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
    form: "puntosVentasForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;