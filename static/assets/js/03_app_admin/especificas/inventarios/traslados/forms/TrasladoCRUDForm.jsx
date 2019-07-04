import React, {memo, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {reduxForm, formValueSelector} from 'redux-form';
import {MyCombobox} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import * as actions from "../../../../../01_actions/01_index";

const selector = formValueSelector('trasladoForm');
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
        error
    } = props;
    const form_values = useSelector(state => selector(state, 'bodega_origen', 'bodega_destino'));
    const {bodega_origen, bodega_destino} = form_values;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.fetchBodegas());
        return () => {
            dispatch(actions.clearBodegas());
        }
    }, []);
    const bodegas = useSelector(state => state.bodegas);
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
                className="col-12 col-md-6"
                nombre='Bodega Origen'
                name='bodega_origen'
                valuesField='id'
                textField='nombre'
                data={_.map(_.pickBy(bodegas, b => b.id !== bodega_destino))}
                placeholder='Seleccione Bodega Origen...'
                filter={'contains'}
            />
            <MyCombobox
                className="col-12 col-md-6"
                nombre='Bodega Destino'
                name='bodega_destino'
                valuesField='id'
                textField='nombre'
                data={_.map(_.pickBy(bodegas, b => b.id !== bodega_origen))}
                placeholder='Seleccione Bodega Destino...'
                filter={'contains'}
            />

            <div style={{height: '300px'}}>
            </div>
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "trasladoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;