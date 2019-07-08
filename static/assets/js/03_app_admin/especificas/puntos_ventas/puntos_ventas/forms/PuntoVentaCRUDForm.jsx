import React, {useEffect} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCombobox, MyDropdownList} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../../01_actions";
import {useSelector} from "react-redux/es/hooks/useSelector";

let Form = (props) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.fetchTiposHabitaciones({callback: () => dispatch(actions.fetchBodegas())}));
        return () => {
            dispatch(actions.clearBodegas());
        }
    }, []);
    const bodegas = useSelector(state => state.bodegas);
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
                className="col-12 col-md-6"
                nombre='Nombre'
                name='nombre'
                case='U'/>

            <MyCombobox
                className="col-12 col-md-6"
                nombre='Bodega'
                name='bodega'
                textField='nombre'
                valuesField='id'
                data={_.map(bodegas, h => {
                    return ({
                        id: h.id,
                        nombre: h.nombre
                    })
                })}
                filter='contains'
            />

            <MyDropdownList
                className="col-12 col-md-6"
                data={[
                    {id: 1, nombre: 'Servicios'},
                    {id: 2, nombre: 'Tienda'},
                    {id: 3, nombre: 'Parqueadero'},
                ]}
                textField='nombre'
                nombre='Tipo Punto Venta'
                name='tipo'
                valuesField='id'
            />

        </MyFormTagModal>
    )
};

Form = reduxForm({
    form: "puntosVentasForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;