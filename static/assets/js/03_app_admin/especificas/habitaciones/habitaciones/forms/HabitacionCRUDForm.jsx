import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import * as actions from '../../../../../01_actions/01_index';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox,
    MyCheckboxSimple
} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


let Form = (props) => {
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
        dispatch(actions.fetchTiposHabitaciones({callback: () => dispatch(actions.fetchEmpresas())}));
        return () => {
            dispatch(actions.clearEmpresas());
            dispatch(actions.clearTiposHabitaciones());
        }
    }, []);
    const empresas = useSelector(state => state.empresas);
    const habitaciones_tipos = useSelector(state => state.habitaciones_tipos);
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
                className="col-12 col-md-2"
                nombre='Número'
                name='numero'
            />
            <MyCombobox
                className="col-12 col-md-5"
                nombre='Tipo Habitación'
                name='tipo'
                textField='nombre'
                placeholder='Seleccionar Tipo Habitación'
                valuesField='id'
                data={_.map(habitaciones_tipos, h => {
                    return ({
                        id: h.id,
                        nombre: h.nombre
                    })
                })}
                filter='contains'
            />
            <MyCombobox
                className="col-12 col-md-5"
                nombre='Empresa'
                name='empresa'
                textField='nombre'
                placeholder='Seleccionar Empresa'
                valuesField='id'
                data={_.map(empresas, h => {
                    return ({
                        id: h.id,
                        nombre: h.nombre
                    })
                })}
                filter='contains'
            />
            <MyCheckboxSimple
                nombre='Activo'
                className="col-12"
                name='activa'
            />
        </MyFormTagModal>
    )
};

Form = reduxForm({
    form: "habitacionesForm",
    validate,
    enableReinitialize: true
})(Form);
export default Form;