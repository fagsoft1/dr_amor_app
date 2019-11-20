import React, {memo, useEffect} from 'react';
import {formValueSelector, reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCombobox} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import InputAdornment from '@material-ui/core/InputAdornment/index';
import {pesosColombianos} from "../../../../../00_utilities/common";
import Typography from '@material-ui/core/Typography/index';
import * as actions from '../../../../../01_actions';
import {useSelector, useDispatch} from 'react-redux';

const selector = formValueSelector('productosForm');

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
    const categorias_dos = useSelector(state => state.productos_categorias_dos);
    const empresas = useSelector(state => state.empresas);
    const unidades = useSelector(state => state.productos_unidades);
    const dispatch = useDispatch();
    const valores = useSelector(state => selector(state, 'precio_venta', 'comision'));

    useEffect(() => {
        dispatch(actions.fetchCategoriasProductosDos());
        return () => {
            dispatch(actions.clearCategoriasProductosDos())
        };
    }, []);

    useEffect(() => {
        dispatch(actions.fetchUnidadesProductos());
        return () => {
            dispatch(actions.clearUnidadesProductos())
        };
    }, []);

    useEffect(() => {
        dispatch(actions.fetchEmpresas());
        return () => {
            dispatch(actions.clearEmpresas())
        };
    }, []);


    const {precio_venta, comision} = valores;
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
                className="col-12 col-md-9"
                nombre='Nombre'
                name='nombre'
                case='U'/>
            <MyTextFieldSimple
                className="col-12 col-md-3"
                nombre='Precio de Venta'
                name='precio_venta'
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
            />
            <MyTextFieldSimple
                className="col-12 col-md-7"
                nombre='Comisión'
                name='comision'
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
            />
            <MyCombobox
                className="col-12 col-md-6"
                label='Empresa'
                label_space_xs={4}
                name='empresa'
                textField='nombre'
                placeholder='Seleccionar Empresa...'
                valuesField='id'
                data={_.map(empresas, h => {
                    return ({
                        id: h.id,
                        nombre: h.nombre
                    })
                })}
                filter='contains'
            />
            <MyCombobox
                className="col-12 col-md-6"
                label='Unidad'
                label_space_xs={4}
                name='unidad_producto'
                textField='nombre'
                placeholder='Seleccionar Unidad...'
                valuesField='id'
                data={_.map(unidades, h => {
                    return ({
                        id: h.id,
                        nombre: h.nombre
                    })
                })}
                filter='contains'
            />
            <MyCombobox
                className="col-12 col-md-12"
                label_space_xs={4}
                label='Categoria'
                name='categoria_dos'
                textField='nombre'
                placeholder='Seleccionar Categoria...'
                valuesField='id'
                data={_.map(categorias_dos, h => {
                    return ({
                        id: h.id,
                        nombre: `${h.nombre} - ${h.categoria_nombre}`
                    })
                })}
                filter='contains'
            />
            <div className="col-12">
                <Typography variant="body1" gutterBottom>
                    <strong>Comisión: </strong>{pesosColombianos(comision)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Precio de Venta sin Comisión: </strong>{pesosColombianos(precio_venta - comision)}
                </Typography>
            </div>
        </MyFormTagModal>
    )
});


Form = reduxForm({
    form: "productosForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;