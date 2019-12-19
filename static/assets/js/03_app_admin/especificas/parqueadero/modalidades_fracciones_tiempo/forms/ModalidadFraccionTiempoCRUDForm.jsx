import React, {memo, useEffect} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyCombobox,
    MyTextFieldSimple,
    MyCheckboxSimple
} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../../01_actions";
import {useSelector} from "react-redux/es/hooks/useSelector";
import ImpuestoTablaRelacion from "../../../contabilidad/configuracion/impuestos/ImpuestoTablaRelacion";


let Form = memo((props) => {
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
    const dispatch = useDispatch();
    useEffect(() => {
        const cargarTiposComprobantesContablesEmpresas = () => dispatch(actions.fetchTiposComprobantesContablesEmpresas());
        const cargarTiposVehiculos = () => dispatch(actions.fetchTiposVehiculos({callback: cargarTiposComprobantesContablesEmpresas}));
        dispatch(actions.fetchTiposHabitaciones({callback: cargarTiposVehiculos}));
        return () => {
            dispatch(actions.clearTiposVehiculos());
        }
    }, []);
    let tipos_comprobantes_empresas = useSelector(state => state.contabilidad_tipos_comprobantes_empresas);
    tipos_comprobantes_empresas = _.pickBy(tipos_comprobantes_empresas, e => e.activo || e.id === initialValues.tipo_comprobante_contable_empresa);
    const tipos_vehiculos = useSelector(state => state.parqueadero_tipos_vehiculos);


    const adicionarImpuesto = (impuesto_id) => {
        return dispatch(actions.adicionarQuitarImpuestoModalidadFraccionTiempo(initialValues.id, impuesto_id, 'add'));
    };
    const quitarImpuesto = (impuesto_id) => {
        return dispatch(actions.adicionarQuitarImpuestoModalidadFraccionTiempo(initialValues.id, impuesto_id, 'del'))
    };

    return (
        <MyFormTagModal
            fullScreen={true}
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
                className="col-12 col-md-6"
                label='Tipo Vehículo'
                label_space_xs={4}
                name='tipo_vehiculo'
                textField='nombre'
                placeholder='Seleccionar Tipo Vehiculo...'
                valuesField='id'
                data={_.map(tipos_vehiculos, h => {
                    return ({
                        id: h.id,
                        nombre: h.nombre
                    })
                })}
                filter='contains'
            />
            <MyCombobox
                label_space_xs={4}
                label='Tipo Comprobante Contable'
                className="col-12 col-md-6"
                placeholder='Seleccionar Tipo Comprobante...'
                name='tipo_comprobante_contable_empresa'
                textField='nombre'
                valuesField='id'
                data={_.map(tipos_comprobantes_empresas, h => {
                    return ({
                        id: h.id,
                        nombre: h.to_string
                    })
                })}
                filter='contains'
            />
            <div className="col-12">
                <div className="row">
                    <MyTextFieldSimple
                        className="col-12 col-md-6"
                        label='Nombre'
                        name='nombre'
                        case='U'
                    />
                    <MyTextFieldSimple
                        className="col-12 col-md-3"
                        name='hora_inicio'
                        label="Hora Inicio"
                        type="time"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    <MyTextFieldSimple
                        className="col-12 col-md-3"
                        name="numero_horas"
                        label="# Horas"
                        type="number"
                    />
                </div>
            </div>
            <div className="col-12">
                <div className="row">
                    <MyCheckboxSimple className='col-12 col-md-4 col-lg-3 col-xl-1' label='Lunes' name='lunes'/>
                    <MyCheckboxSimple className='col-12 col-md-4 col-lg-3 col-xl-1' label='Martes' name='martes'/>
                    <MyCheckboxSimple className='col-12 col-md-4 col-lg-3 col-xl-1' label='Miércoles' name='miercoles'/>
                    <MyCheckboxSimple className='col-12 col-md-4 col-lg-3 col-xl-1' label='Jueves' name='jueves'/>
                    <MyCheckboxSimple className='col-12 col-md-4 col-lg-3 col-xl-1' label='Viernes' name='viernes'/>
                    <MyCheckboxSimple className='col-12 col-md-4 col-lg-3 col-xl-1' label='Sábado' name='sabado'/>
                    <MyCheckboxSimple className='col-12 col-md-4 col-lg-3 col-xl-1' label='Domingo' name='domingo'/>
                </div>
            </div>
            {initialValues && <div className="col-12 mt-2">
                <ImpuestoTablaRelacion
                    impuestos_relacionados={initialValues.impuestos}
                    onAdd={adicionarImpuesto}
                    onDelete={quitarImpuesto}
                />
            </div>}
        </MyFormTagModal>
    )
});
Form = reduxForm({
    form: "modalidadFraccionTiempoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;