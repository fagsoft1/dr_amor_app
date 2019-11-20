import React, {memo, useEffect} from 'react';
import {reduxForm} from 'redux-form';
import {useDispatch, useSelector} from 'react-redux';
import {
    MyTextFieldSimple,
    MyCombobox,
    MyCheckboxSimple
} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import * as actions from "../../../../../01_actions";

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
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.fetchDiariosContables());
        dispatch(actions.fetchTiposComprobantesContablesEmpresas());
        return () => {
            dispatch(actions.clearDiariosContables());
            dispatch(actions.clearTiposComprobantesContablesEmpresas());
        };
    }, []);
    const diarios_contables = useSelector(state => state.contabilidad_diarios_contables);
    const tipo_comprobante_contable_empresa = useSelector(state => state.contabilidad_tipos_comprobantes_empresas);
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
                label_space_xs={4}
                label='Tipo de Cuenta'
                name="tipo"
                placeholder='Seleccionar Tipo Operacion...'
                data={[
                    {id: "DEBITO", nombre: "Ingreso"},
                    {id: "CREDITO", nombre: "Egreso"},
                ]}
                textField='nombre'
                valuesField='id'
                filter='contains'
            />
            <MyCombobox
                className="col-12"
                name="grupo"
                label_space_xs={4}
                label='Grupo de Cuenta'
                placeholder='Seleccionar Grupo...'
                data={[
                    {id: "A", nombre: "Acompañantes"},
                    {id: "C", nombre: "Colaboradores"},
                    {id: "P", nombre: "Proveedores"},
                    {id: "T", nombre: "Taxis"},
                    {id: "O", nombre: "Otros"},
                ]}
                textField='nombre'
                valuesField='id'
                filter='contains'

            />
            <MyCombobox
                label_space_xs={4}
                label='Diario Contable'
                className="col-12"
                placeholder='Seleccionar Diario...'
                name='diario_contable'
                textField='nombre'
                valuesField='id'
                data={_.map(diarios_contables, h => {
                    return ({
                        id: h.id,
                        nombre: h.to_string
                    })
                })}
                filter='contains'
            />
            <MyCombobox
                label_space_xs={4}
                label='Tipo Comprobante Contable'
                className="col-12"
                placeholder='Seleccionar Tipo Comprobante...'
                name='tipo_comprobante_contable_empresa'
                textField='nombre'
                valuesField='id'
                data={_.map(tipo_comprobante_contable_empresa, h => {
                    return ({
                        id: h.id,
                        nombre: h.to_string
                    })
                })}
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