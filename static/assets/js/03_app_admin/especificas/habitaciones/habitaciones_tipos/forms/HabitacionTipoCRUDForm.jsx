import React from 'react';
import {formValueSelector, reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import {pesosColombianos} from '../../../../../00_utilities/common';
import {useDispatch, useSelector} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import Typography from '@material-ui/core/Typography/index';
import InputAdornment from '@material-ui/core/InputAdornment/index';
import * as actions from '../../../../../01_actions';
import ImpuestoTablaRelacion from '../../../contabilidad/configuracion/impuestos/ImpuestoTablaRelacion';

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
        error
    } = props;
    const dispatch = useDispatch();
    const valores = useSelector(state => selector(state, 'porcentaje_impuesto', 'valor', 'comision'));
    const adicionarImpuesto = (impuesto_id) => {
        return dispatch(actions.adicionarQuitarImpuestoTipoHabitacion(initialValues.id, impuesto_id));
    };
    const quitarImpuesto = (impuesto_id) => {
        return dispatch(actions.adicionarQuitarImpuestoTipoHabitacion(initialValues.id, impuesto_id))
    };
    return (
        <MyFormTagModal
            fullScreen={true}
            onCancel={onCancel}
            onSubmit={handleSubmit(v => {
                dispatch(actions.fetchImpuestos());
                return onSubmit(v, null, null, false);
            })}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
            error={error}
        >
            <MyTextFieldSimple
                className="col-12 col-md-5"
                label='Nombre'
                name='nombre'
                case='U'
            />
            <MyTextFieldSimple
                className="col-12 col-md-3 ml-3"
                label='Valor'
                name='valor'
                inputProps={{
                    style: {textAlign: "right"}
                }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
            />
            <MyTextFieldSimple
                className="col-12 col-md-3 ml-3"
                label='Valor Add. Servicio'
                name='valor_adicional_servicio'
                inputProps={{
                    style: {textAlign: "right"}
                }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
            />
            {initialValues && <div className="col-12 mt-2">
                <ImpuestoTablaRelacion
                    impuestos_relacionados={initialValues.impuestos}
                    onAdd={adicionarImpuesto}
                    onDelete={quitarImpuesto}
                />
            </div>}
            {initialValues && <div className="col-12">
                <Typography variant="body1" gutterBottom>
                    <strong>Valor sin
                        Impuestos: </strong>{pesosColombianos(initialValues.valor_antes_impuestos)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Impuestos: </strong>{pesosColombianos(initialValues.impuesto)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Valor: </strong>{pesosColombianos(initialValues.valor)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>$ Adi.
                        Servicio: </strong>{pesosColombianos(initialValues.valor_adicional_servicio)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>$
                        Total: </strong>{pesosColombianos(parseFloat(initialValues.valor) + parseFloat(initialValues.valor_adicional_servicio))}
                </Typography>
            </div>}
        </MyFormTagModal>
    )
};


const selector = formValueSelector('habitacionesTipoForm');

Form = reduxForm({
    form: "habitacionesTipoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;