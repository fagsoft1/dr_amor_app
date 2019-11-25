import React, {memo, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCombobox} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import * as actions from '../../../../../01_actions';


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
    const categorias = useSelector(state => state.productos_categorias);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.fetchCategoriasProductos());
        return () => dispatch(actions.clearCategoriasProductos());
    }, []);
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
                case='U'/>
            <MyTextFieldSimple
                className="col-12 col-md-2"
                label='Código'
                name='codigo'
                case='U'/>

            <MyCombobox
                className="col-12 col-md-8"
                label_space_xs={4}
                label='Categoría'
                name='categoria'
                textField='nombre'
                placeholder='Seleccionar Categoría...'
                valuesField='id'
                data={_.map(categorias, h => {
                    return ({
                        id: h.id,
                        nombre: h.nombre
                    })
                })}
                filter='contains'
            />
        </MyFormTagModal>
    )
});
Form = reduxForm({
    form: "categoriaDosProductoForm",
    validate,
    enableReinitialize: true
})(Form);


export default Form;