import React, {Component} from 'react';
import {MyTextFieldSimple, MySelect} from '../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {reduxForm, formValueSelector} from 'redux-form'
import {pesosColombianos} from "../../../../00_utilities/common";
import validate from './validate';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';


class RegistroOperacionForm extends Component {
    componentDidMount() {
        const cargarConceptosOperacionesCaja = () => this.props.fetchConceptosOperacionesCajas();
        const cargarProveedores = () => this.props.fetchProveedores({callback: cargarConceptosOperacionesCaja});
        const cargarColaboradores = () => this.props.fetchColaboradores({callback: cargarProveedores});
        this.props.fetchAcompanantesPresentes({callback: cargarColaboradores});
    }

    componentWillUnmount() {
        this.props.clearProveedores();
        this.props.clearAcompanantes();
        this.props.clearColaboradores();
        this.props.clearConceptosOperacionesCajas();
    }

    render() {
        const {
            conceptos_operaciones_caja,
            acompanantes,
            proveedores,
            colaboradores,
            handleSubmit,
            modal_open,
            submitting,
            pristine,
            reset,
            auth: {user: {punto_venta_actual}},
            cerrarModal,
            form_values,
            error,
        } = this.props;

        const tipos_conceptos = _.unionBy(
            _.map(conceptos_operaciones_caja, e => {
                return {value: e.tipo, label: e.tipo_display}
            }),
            'label'
        );
        const grupos_conceptos = form_values && form_values.tipo ? _.unionBy(
            _.map(
                _.pickBy(conceptos_operaciones_caja, e => e.tipo === form_values.tipo.value),
                e => {
                    return {value: e.grupo, label: e.grupo_display}
                }
            ), 'label') : null;
        const conceptos = form_values && form_values.grupo ? _.map(
            _.pickBy(
                conceptos_operaciones_caja, e => e.grupo === form_values.grupo.value && e.tipo === form_values.tipo.value
            ),
            e => {
                return {value: e.id, label: e.descripcion}
            }
        ) : null;

        let listado_terceros = null;
        if (form_values.grupo) {
            switch (form_values.grupo.value) {
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
        return (
            <MyFormTagModal
                fullScreen={false}
                onCancel={cerrarModal}
                onSubmit={handleSubmit((v) => {
                    this.props.createOperacionCaja({
                        grupo_operaciones: v.grupo.label,
                        descripcion: v.concepto.label,
                        observacion: v.observacion,
                        concepto: v.concepto.value,
                        valor: v.valor,
                        tercero: v.tercero ? v.tercero.value : null,
                        punto_venta: punto_venta_actual.id
                    });
                    cerrarModal();
                })}
                reset={reset}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type='Operación Caja'
                error={error}
            >
                <div className="row p-1">
                    {
                        tipos_conceptos &&
                        <MySelect
                            className="col-12 col-md-6"
                            name='tipo'
                            nombre='Tipo Operación'
                            data={tipos_conceptos}
                            placeholder='Tipo Operación...'
                            isDisabled={form_values.grupo}
                        />
                    }
                    {
                        form_values.tipo &&
                        grupos_conceptos &&
                        <MySelect
                            className="col-12 col-md-6"
                            name='grupo'
                            nombre='Grupo'
                            data={grupos_conceptos}
                            isDisabled={form_values.concepto}
                            placeholder='Grupo...'
                        />
                    }
                    {
                        form_values.grupo &&
                        conceptos &&
                        <MySelect
                            className="col-12 col-md-6"
                            name='concepto'
                            nombre='Concepto'
                            data={conceptos}
                            placeholder='Concepto...'
                            isDisabled={form_values.tercero}
                        />
                    }
                    {
                        form_values.concepto &&
                        listado_terceros &&
                        <MySelect
                            className="col-12 col-md-6"
                            name='tercero'
                            nombre='Tercero'
                            data={_.map(listado_terceros, a => {
                                return {value: a.id, label: a.full_name_proxy}
                            })}
                            placeholder='Tercero...'
                        />
                    }
                    <div className="col-12">
                        <div className="row">
                            <MyTextFieldSimple
                                type='number'
                                name='valor'
                                nombre='Valor'
                                className='col-12 col-md-4'
                            />
                            {
                                form_values.valor &&
                                <div className="col-12 col-4">
                                    {pesosColombianos(form_values.valor)}
                                </div>
                            }
                        </div>
                    </div>
                    <MyTextFieldSimple
                        name='observacion'
                        nombre='Observación'
                        className='col-12'
                        multiline={true}
                        rows={2}
                        rowsMax={2}
                    />
                </div>
            </MyFormTagModal>
        )
    }
}

const selector = formValueSelector('registroOperacionForm');

function mapPropsToState(state, ownProps) {
    const form_values = selector(state, 'tipo', 'grupo', 'tercero', 'concepto', 'valor');
    return {
        auth: state.auth,
        form_values,
        conceptos_operaciones_caja: state.conceptos_operaciones_caja,
        acompanantes: state.acompanantes,
        proveedores: state.proveedores,
        colaboradores: state.colaboradores,
    }
}

RegistroOperacionForm = reduxForm({
    form: "registroOperacionForm",
    validate,
    enableReinitialize: true
})(RegistroOperacionForm);

export default (connect(mapPropsToState, null)(RegistroOperacionForm));