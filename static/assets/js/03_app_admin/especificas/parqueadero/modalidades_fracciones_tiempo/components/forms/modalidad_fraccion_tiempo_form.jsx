import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyCombobox,
    MyTextFieldSimple,
    MyCheckboxSimple
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
            tipos_vehiculos_list,
            error,
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
                error={error}
            >
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Nombre'
                    name='nombre'
                    case='U'
                />
                <MyCombobox
                    className="col-12"
                    nombre='Tipo Vehículo'
                    name='tipo_vehiculo'
                    textField='nombre'
                    placeholder='Seleccionar Tipo Vehiculo'
                    valuesField='id'
                    data={_.map(tipos_vehiculos_list, h => {
                        return ({
                            id: h.id,
                            nombre: h.nombre
                        })
                    })}
                    filter='contains'
                />
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <MyTextFieldSimple
                                name='hora_inicio'
                                label="Hora Inicio"
                                type="time"
                                defaultValue="07:30"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300, // 5 min
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <MyTextFieldSimple
                                name="numero_horas"
                                label="# Horas"
                                type="number"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <MyCheckboxSimple nombre='Lunes' name='lunes'/>
                    <MyCheckboxSimple nombre='Martes' name='martes'/>
                    <MyCheckboxSimple nombre='Miércoles' name='miercoles'/>
                    <MyCheckboxSimple nombre='Jueves' name='jueves'/>
                    <MyCheckboxSimple nombre='Viernes' name='viernes'/>
                    <MyCheckboxSimple nombre='Sábado' name='sabado'/>
                    <MyCheckboxSimple nombre='Domingo' name='domingo'/>
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
    form: "categoriaProductoForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;