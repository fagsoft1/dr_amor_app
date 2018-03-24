import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
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
            solo_bodegas_principales: true,
            mostrar_observacions: false,
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
        } = this.props;
        const {solo_bodegas_principales, mostrar_observacions} = this.state;

        let bodegas = bodegas_list;
        if (solo_bodegas_principales) {
            bodegas = _.pickBy(bodegas_list, e => e.es_principal);
        }

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
                        let con_observaciones = false;
                        if (e.detalle === 'saldo_inicial' || e.detalle === 'compra') {
                            solo_principales = true;
                        }
                        if (e.detalle === 'ajuste_ingreso' || e.detalle === 'ajuste_salida') {
                            con_observaciones = true;
                        }
                        this.setState({
                            solo_bodegas_principales: solo_principales,
                            mostrar_observacions: con_observaciones
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
                        // {
                        //     motivo: 'Ajuste Ingreso',
                        //     detalle: 'ajuste_ingreso'
                        // },
                        // {
                        //     motivo: 'Ajuste Salida',
                        //     detalle: 'ajuste_salida'
                        // },
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
                />
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
                />

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
                        multiLine={true}
                        rows={4}
                    />
                }
                <div style={{height: '300px'}}>

                </div>
            </MyFormTagModal>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        initialValues: item_seleccionado
    }
}

Form = reduxForm({
    form: "movimientosInventariosForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;