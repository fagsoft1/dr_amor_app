import React, {memo, useEffect} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyCombobox,
    MyTextFieldSimple,
    MyCheckboxSimple
} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import InputAdornment from "@material-ui/core/InputAdornment/index";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../../01_actions";
import {useSelector} from "react-redux/es/hooks/useSelector";


let Form = memo((props) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.fetchTiposHabitaciones());
        return () => {
            dispatch(actions.clearTiposHabitaciones());
        }
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
            <MyTextFieldSimple
                className="col-12"
                label='Nombre'
                name='nombre'
                case='U'
            />
            <MyCheckboxSimple
                label='Tiene Placa'
                name='tiene_placa'
                className="col-12"
            />
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "tipoVehiculoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;