import React, {memo} from 'react';
import {reduxForm, formValueSelector} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox,
    MyCheckboxSimple
} from '../../../../../00_utilities/components/ui/forms/fields';
import {useSelector} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';

const selector = formValueSelector('conceptoOperacionCajaForm');

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
        error
    } = props;
    const form_values = useSelector(state => selector(state, 'grupo', 'tipo'));
    let opciones_tipos_cuentas = [
        {id: "NA", nombre: "No Aplica"},
    ];
    const mostrar_tipos_cuentas = form_values && form_values.grupo && ['A', 'C'].includes(form_values.grupo);
    if (mostrar_tipos_cuentas) {
        opciones_tipos_cuentas = [
            ...opciones_tipos_cuentas,
            {id: "CXC", nombre: "Cuenta x Cobrar"},
            {id: "CXP", nombre: "Cuenta x Pagar"},
        ];
    }
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
            fullScreen={false}
            error={error}
        >
            <MyTextFieldSimple
                className="col-12"
                nombre='Descripción'
                name='descripcion'
                case='U'/>
            <MyCombobox
                className="col-12"
                name="tipo"
                nombre='Tipo'
                data={[
                    {id: "I", nombre: "Ingreso"},
                    {id: "E", nombre: "Egreso"},
                ]}
                textField='nombre'
                valuesField='id'
                placeholder='Tipo Operación...'
                filter='contains'
            />
            <MyCombobox
                className="col-12"
                name="grupo"
                nombre='Grupo'
                data={[
                    {id: "A", nombre: "Acompañantes"},
                    {id: "C", nombre: "Colaboradores"},
                    {id: "P", nombre: "Proveedores"},
                    {id: "T", nombre: "Taxis"},
                    {id: "O", nombre: "Otros"},
                ]}
                textField='nombre'
                valuesField='id'
                placeholder='Tipo Operación...'
                filter='contains'

            />
            <MyCombobox
                className="col-12"
                name="tipo_cuenta"
                nombre='Tipo Cuenta'
                data={opciones_tipos_cuentas}
                textField='nombre'
                valuesField='id'
                placeholder='Tipo de Cuenta...'
                filter='contains'

            />
            <MyCheckboxSimple
                className='col-12'
                name='reporte_independiente'
                nombre='En Reporte Independiente'
            />
        </MyFormTagModal>
    )
});
Form = reduxForm({
    form: "conceptoOperacionCajaForm",
    validate,
    enableReinitialize: true
})(Form);
export default Form;