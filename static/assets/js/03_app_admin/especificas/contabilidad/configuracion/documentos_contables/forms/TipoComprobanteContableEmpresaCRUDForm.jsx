import React, {memo, useEffect, Fragment} from 'react';
import {formValueSelector, reduxForm} from 'redux-form';
import {useSelector} from 'react-redux';
import {
    MyTextFieldSimple,
    MyDateTimePickerField,
    MyCombobox,
    MyCheckboxSimple
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import {useDispatch} from "react-redux";
import * as actions from '../../../../../../01_actions';


import validate from './validate_comprobante_contable_empresas';

const selector = formValueSelector('tipoComprobanteContableEmpresaForm');
let Form = memo(props => {
    const dispatch = useDispatch();
    const empresas = useSelector(state => state.empresas);
    const form_values = useSelector(state => selector(state, 'tiene_vigencia', 'empresa'));
    const {tiene_vigencia} = form_values;
    useEffect(() => {
        dispatch(actions.fetchEmpresas());
    }, []);
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
        error,
    } = props;
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
            <MyCombobox
                label='Empresa'
                label_space_xs={2}
                className="col-12"
                name='empresa'
                textField='nombre'
                placeholder='Seleccionar empresa...'
                valuesField='id'
                data={_.map(empresas, h => {
                    return ({
                        id: h.id,
                        nombre: h.nombre
                    })
                })}
                filter='contains'
            />
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Número Autorización'
                name='numero_autorizacion'
            />
            <MyDateTimePickerField
                nombre='Fecha Autorización'
                className='col-12 col-md-6'
                name='fecha_autorizacion'
            />
            <div className="col-12">
                <div className="row">
                    <MyTextFieldSimple
                        className="col-12 col-md-4"
                        nombre='Consecutivo Actual'
                        name='consecutivo_actual'
                        type='number'
                    />
                    <MyTextFieldSimple
                        className="col-12 col-md-4"
                        nombre='Rango Inferior Numeración'
                        name='rango_inferior_numeracion'
                        type='number'
                    />
                    <MyTextFieldSimple
                        className="col-12 col-md-4"
                        nombre='Rango Superior Numeración'
                        name='rango_superior_numeracion'
                        type='number'
                    />
                </div>
            </div>
            <div className="col-12">
                <div className="row">
                    <MyCheckboxSimple nombre='Con Vigencia' name='tiene_vigencia'/>
                    {tiene_vigencia &&
                    <Fragment>
                        <MyDateTimePickerField
                            nombre='Fecha Inicial Vigencia'
                            className='col-12 col-md-4'
                            name='fecha_inicial_vigencia'
                        />
                        <MyDateTimePickerField
                            nombre='Fecha Final Vigencia'
                            className='col-12 col-md-4'
                            name='fecha_final_vigencia'
                        />
                    </Fragment>}
                </div>
            </div>
            <div className="col-12">
                <div className="row">
                    <MyTextFieldSimple
                        className="col-12 col-md-6"
                        nombre='País Emisión'
                        name='pais_emision'
                    />
                    <MyTextFieldSimple
                        className="col-12 col-md-6"
                        nombre='Ciudad Emisión'
                        name='ciudad_emision'
                    />
                    <MyTextFieldSimple
                        className="col-12 col-md-6"
                        nombre='Dirección Emisión'
                        name='direccion_emision'
                    />
                    <MyTextFieldSimple
                        className="col-12 col-md-6"
                        nombre='Teléfono Emisión'
                        name='telefono_emision'
                    />
                </div>
            </div>
            <MyCheckboxSimple
                className="col-12"
                nombre='Activo'
                name='activo'
            />
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "tipoComprobanteContableEmpresaForm",
    validate,
    enableReinitialize: true
})(Form);


export default Form;