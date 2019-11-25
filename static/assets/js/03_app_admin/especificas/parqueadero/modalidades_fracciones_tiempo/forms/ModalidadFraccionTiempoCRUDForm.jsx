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
        dispatch(actions.fetchTiposHabitaciones({callback: () => dispatch(actions.fetchTiposVehiculos())}));
        return () => {
            dispatch(actions.clearTiposVehiculos());
        }
    }, []);
    const tipos_vehiculos = useSelector(state => state.parqueadero_tipos_vehiculos);
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
                label='Nombre'
                name='nombre'
                case='U'
            />
            <MyCombobox
                className="col-12"
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
                <MyCheckboxSimple label='Lunes' name='lunes'/>
                <MyCheckboxSimple label='Martes' name='martes'/>
                <MyCheckboxSimple label='Miércoles' name='miercoles'/>
                <MyCheckboxSimple label='Jueves' name='jueves'/>
                <MyCheckboxSimple label='Viernes' name='viernes'/>
                <MyCheckboxSimple label='Sábado' name='sabado'/>
                <MyCheckboxSimple label='Domingo' name='domingo'/>
            </div>
        </MyFormTagModal>
    )
});
Form = reduxForm({
    form: "modalidadFraccionTiempoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;