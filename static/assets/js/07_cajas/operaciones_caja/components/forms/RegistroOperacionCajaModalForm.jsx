import React, {useEffect} from 'react';
import {reduxForm, formValueSelector} from 'redux-form';
import {MyFormTagModal} from "../../../../00_utilities/components/ui/forms/MyFormTagModal";
import {useSelector, useDispatch} from "react-redux";
import {MyCombobox, MySelect, MyTextFieldSimple} from "../../../../00_utilities/components/ui/forms/fields";
import * as actions from '../../../../01_actions/';
import InputAdornment from "@material-ui/core/InputAdornment";
import validate from './validate';
import Typography from "@material-ui/core/Typography";
import {pesosColombianos} from "../../../../00_utilities/common";
import PrinJs from "print-js";

const selector = formValueSelector('registroOperacionCajaModalForm');
let RegistroOperacionCajaModalForm = (props) => {
    const dispatch = useDispatch();
    const form_values = useSelector(state => selector(state, 'tipo', 'grupo', 'tercero', 'concepto', 'valor'));
    const {valor = null, tipo = null, grupo = null, tercero = null, concepto = null} = form_values;
    const {
        handleSubmit,
        modal_open,
        submitting,
        pristine,
        reset,
        cerrarModal,
        error,
        change,
    } = props;

    useEffect(() => {
        dispatch(actions.fetchConceptosOperacionesCajas());
        return () => {
            dispatch(actions.clearProveedores());
            dispatch(actions.clearAcompanantes());
            dispatch(actions.clearColaboradores());
            dispatch(actions.clearConceptosOperacionesCajas());
        }
    }, []);

    useEffect(() => {
        if (grupo === 'A') {
            dispatch(actions.fetchAcompanantesPresentes());
        } else if (grupo === 'C') {
            dispatch(actions.fetchColaboradores())
        } else if (grupo === 'P') {
            dispatch(actions.fetchProveedores())
        }
    }, [grupo]);

    let colaboradores = useSelector(state => state.colaboradores);
    let acompanantes = useSelector(state => state.acompanantes);
    let proveedores = useSelector(state => state.proveedores);
    let conceptos_operaciones_caja = useSelector(state => state.conceptos_operaciones_caja);

    const tipos_conceptos = _.uniqBy(_.map(conceptos_operaciones_caja, e => ({
        id: e.tipo,
        name: e.tipo_display
    })), 'name');

    const grupos_conceptos = tipo ? _.unionBy(_.map(
        _.pickBy(conceptos_operaciones_caja, e => e.tipo === tipo), e => ({
            id: e.grupo,
            name: e.grupo_display
        })), 'name') : null;

    const conceptos = grupo ? _.map(_.pickBy(conceptos_operaciones_caja, e => e.grupo === grupo && e.tipo === tipo), e => ({
        id: e.id,
        name: e.descripcion
    })) : null;


    let listado_terceros = null;
    if (form_values.grupo) {
        switch (grupo) {
            case 'A':
                listado_terceros = acompanantes;
                break;
            case 'P':
                listado_terceros = proveedores;
                break;
            case 'C':
                listado_terceros = colaboradores;
                break;
        }
    }

    const onSubmit = (v) => {
        dispatch(actions.asentarOperacionContableAsientoContable(v, {callback: cerrarModal}))
    };

    const callback_impresiones_dos = (response) => {
        const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
        PrinJs(url);
    };
    const callback_impresiones = (response) => {
        const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
        window.open(url, "_blank");

    };
    const imprimirAsiento = () => dispatch(actions.printComprobanteAsientoContable(2, {callback: callback_impresiones_dos}));

    return (
        <MyFormTagModal
            fullScreen={false}
            onCancel={cerrarModal}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type='Operación Caja'
            error={error}
        >
            <span className='puntero' onClick={imprimirAsiento}>PRUEB</span>
            <MyCombobox
                className="col-12 col-md-6"
                label='Tipo Operación'
                label_space_xs={4}
                name='tipo'
                textField='name'
                placeholder='Seleccionar Tipo Operación...'
                valuesField='id'
                onSelect={() => {
                    change('grupo', null);
                    change('tercero', null);
                    change('concepto', null);
                }}
                data={tipos_conceptos}
                filter='contains'
            />
            {tipo && <MyCombobox
                className="col-12 col-md-6"
                label='Grupo'
                label_space_xs={4}
                onSelect={() => {
                    change('tercero', null);
                    change('concepto', null);
                }}
                name='grupo'
                textField='name'
                placeholder='Seleccionar Grupo...'
                valuesField='id'
                data={grupos_conceptos}
                filter='contains'
            />}
            {grupo && <MyCombobox
                className="col-12"
                label='Concepto'
                label_space_xs={4}
                name='concepto'
                textField='name'
                placeholder='Seleccionar Concepto...'
                valuesField='id'
                data={conceptos}
                filter='contains'
                readOnly={!!tercero}
            />}
            {concepto && listado_terceros && <MyCombobox
                className="col-12"
                label='Tercero'
                label_space_xs={4}
                name='tercero'
                textField='name'
                placeholder='Seleccionar Tercero...'
                valuesField='id'
                data={_.map(listado_terceros, e => ({id: e.id, name: e.full_name_proxy}))}
                filter='contains'
            />}
            <MyTextFieldSimple
                name='observacion'
                label='Observación'
                className='col-12'
                multiline={true}
                rows={2}
                rowsMax={2}
            />
            <MyTextFieldSimple
                type='number'
                name='valor'
                label='Valor'
                className='col-12 col-md-4'
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
            />
            <div className="col-12 col-md-8">
                <Typography variant="h2" gutterBottom color="primary">
                    {pesosColombianos(valor)}
                </Typography>
            </div>
        </MyFormTagModal>
    )

};
RegistroOperacionCajaModalForm = reduxForm({
    form: "registroOperacionCajaModalForm",
    validate,
    enableReinitialize: true
})(RegistroOperacionCajaModalForm);

export default RegistroOperacionCajaModalForm;