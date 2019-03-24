import React, {Component} from 'react';
import {reduxForm, formValueSelector} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox,
    MyDateTimePickerField,
    MyDropdownList
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


class Form extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            solo_bodegas_principales: true
        });
    }

    render() {
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
            proveedores_list,
            bodegas_list,
            error,
            valores: {motivo},
        } = this.props;
        const {solo_bodegas_principales,} = this.state;

        const mostrar_observacions = ['entrada_ajuste', 'salida_ajuste'].includes(motivo);
        const mostrar_proveedor = ['compra'].includes(motivo);

        let bodegas = bodegas_list;
        if (solo_bodegas_principales) {
            bodegas = _.pickBy(bodegas_list, e => e.es_principal);
        }

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
                <MyDropdownList
                    className="col-12 col-md-6"
                    nombre='Motivo'
                    name='motivo'
                    textField='motivo'
                    placeholder='Seleccionar Motivo'
                    valuesField='detalle'
                    onSelect={(e) => {
                        let solo_principales = false;
                        if (e.detalle === 'saldo_inicial' || e.detalle === 'compra') {
                            solo_principales = true;
                        }
                        this.setState({
                            solo_bodegas_principales: solo_principales
                        });
                    }}
                    data={[
                        {
                            motivo: 'Compra',
                            detalle: 'compra'
                        },
                        {
                            motivo: 'Saldo Inicial',
                            detalle: 'saldo_inicial'
                        },
                        {
                            motivo: 'Entrada Ajuste',
                            detalle: 'entrada_ajuste'
                        },
                        {
                            motivo: 'Salida Ajuste',
                            detalle: 'salida_ajuste'
                        },
                    ]}
                />
                <MyCombobox
                    className="col-12 col-md-6"
                    nombre='Bodega'
                    name='bodega'
                    textField='nombre'
                    placeholder='Seleccionar Bodega'
                    valuesField='id'
                    data={_.map(_.orderBy(bodegas, ['nombre']), h => {
                        return ({
                            id: h.id,
                            nombre: h.nombre
                        })
                    })}
                    filter='contains'
                />
                {
                    mostrar_proveedor &&
                    <MyCombobox
                        className="col-12 col-md-6"
                        nombre='Proveedor'
                        name='proveedor'
                        textField='nombre'
                        placeholder='Seleccionar Proveedor'
                        valuesField='id'
                        data={_.map(proveedores_list, h => {
                            return ({
                                id: h.id,
                                nombre: h.nombre
                            })
                        })}
                        filter='contains'
                    />
                }

                <MyDateTimePickerField
                    nombre='Fecha'
                    className='col-12 col-md-6'
                    name='fecha'
                />

                {
                    mostrar_observacions &&
                    <MyTextFieldSimple
                        nombre='Observación'
                        className='col-12'
                        name='observacion'
                        multiline={true}
                        rows={4}
                    />
                }
                <div style={{height: '300px'}}>

                </div>
            </MyFormTagModal>
        )
    }
}

const selector = formValueSelector('movimientosInventariosForm');


function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    const values = selector(state, 'motivo', '');
    return {
        initialValues: item_seleccionado,
        valores: values
    }
}

Form = reduxForm({
    form: "movimientosInventariosForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;