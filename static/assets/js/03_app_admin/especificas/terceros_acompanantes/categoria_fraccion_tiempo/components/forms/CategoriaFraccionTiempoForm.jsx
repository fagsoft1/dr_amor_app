import React, {memo, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyDropdownList} from '../../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import InputAdornment from '@material-ui/core/InputAdornment';
import * as actions from '../../../../../../01_actions/01_index';

let Form = memo(props => {
    const dispatch = useDispatch();
    const fracciones_tiempo = useSelector(state => state.fracciones_tiempos_acompanantes);
    useEffect(() => {
        dispatch(actions.fetchFraccionesTiemposAcompanantes());
        return () => dispatch(actions.clearFraccionesTiemposAcompanantes());
    },[]);
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
        object,
        categorias_fracciones_tiempo_list,
        error,
    } = props;
    let fracciones_existentes = _.map(categorias_fracciones_tiempo_list, c => c.fraccion_tiempo);
    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit((v) => {
                const categoria_fraccion_tiempo = {...v, categoria: object.id};
                onSubmit(categoria_fraccion_tiempo)
            })}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
            fullScreen={false}
            error={error}
        >
            {
                initialValues ?
                    <span><strong>Fracción Tiempo: </strong>{initialValues.fraccion_tiempo_nombre}</span> :
                    <MyDropdownList
                        data={_.map(_.omit(fracciones_tiempo, fracciones_existentes), f => f)}
                        nombre='Fracción Tiempo'
                        valuesField='id'
                        autoFocus={true}
                        textField='nombre'
                        className="col-12"
                        name='fraccion_tiempo'
                    />
            }
            <MyTextFieldSimple
                className="col-12"
                nombre='Valor'
                name='valor'
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
            />
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "categoriaFraccionTiempoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;