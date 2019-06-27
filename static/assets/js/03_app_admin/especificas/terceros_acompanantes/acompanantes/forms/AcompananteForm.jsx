import React, {useEffect} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCombobox} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import asyncValidate from './asyncValidate';
import CedulaForm from './datos_cedula_acompanante_form';
import LectorCedula from '../../../terceros/componentes/forms/LectorCedulaForm';
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../../../../../01_actions/01_index';

const modelStyle = {
    width: '100%',
    height: '100%',
    maxWidth: 'none',
};

let Form = (props) => {
    const categorias_acompanantes = useSelector(state => state.categorias_acompanantes);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.fetchCategoriasAcompanantes());
        return () => {
            dispatch(actions.clearCategoriasAcompanantes());
        }
    }, []);
    const {
        pristine,
        submitting,
        reset,
        error,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        singular_name,
        setSelectItem,
        permisos_object,
    } = props;
    return (
        <MyFormTagModal
            modelStyle={modelStyle}
            onCancel={onCancel}
            onSubmit={handleSubmit(v => {
                const datos = {
                    ...v,
                    nombre: v.nombre_1,
                    nombre_segundo: v.nombre_segundo_1 ? v.nombre_segundo_1 : '',
                    apellido: v.apellido_1,
                    apellido_segundo: v.apellido_segundo_1 ? v.apellido_segundo_1 : '',
                    nro_identificacion: v.nro_identificacion_1,
                };
                return onSubmit(datos)
            })}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
            error={error}
        >
            <LectorCedula
                setSelectItem={setSelectItem}
            >
                <CedulaForm permisos={permisos_object}/>
                <MyTextFieldSimple
                    className='col-12 col-md-6'
                    nombre='Alias'
                    name='alias_modelo'
                    case='U'
                />
                <MyCombobox
                    className="col-12 col-md-6"
                    name="categoria_modelo"
                    nombre='Categoria'
                    data={_.map(categorias_acompanantes, e => {
                        return {
                            id: e.id,
                            nombre: e.nombre,
                        }
                    })}
                    textField='nombre'
                    valuesField='id'
                    placeholder='Categoría Modelo...'
                    filter='contains'
                />
            </LectorCedula>
        </MyFormTagModal>
    )
}

Form = reduxForm({
    form: "acompanantesForm",
    validate,
    asyncValidate,
    asyncBlurFields: ['nro_identificacion_1', 'tipo_documento', 'alias_modelo'],
    enableReinitialize: true
})(Form);

export default Form;