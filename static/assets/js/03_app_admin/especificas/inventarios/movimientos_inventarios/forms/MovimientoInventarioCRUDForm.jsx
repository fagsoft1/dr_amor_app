import React, {useState, memo, useEffect} from 'react';
import {reduxForm, formValueSelector} from 'redux-form';
import {useDispatch, useSelector} from "react-redux";
import {
    MyTextFieldSimple,
    MyCombobox,
    MyDateTimePickerField,
    MyDropdownList
} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import * as actions from "../../../../../01_actions";

const selector = formValueSelector('movimientosInventariosForm');

let Form = memo(props => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        const cargarBodegas = () => dispatch(actions.fetchBodegas());
        dispatch(actions.fetchProveedores({callback: cargarBodegas}));
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBodegas());
            dispatch(actions.clearProveedores());
        };
    }, []);
    let bodegas = useSelector(state => state.bodegas);
    const proveedores = useSelector(state => state.proveedores);
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
    const [solo_bodegas_principales, setSoloBodegasPrincipales] = useState(true);
    const valores = useSelector(state => selector(state, 'motivo', ''));
    const {motivo} = valores;

    const mostrar_observacions = ['entrada_ajuste', 'salida_ajuste'].includes(motivo);
    const mostrar_proveedor = ['compra'].includes(motivo);
    if (solo_bodegas_principales) {
        bodegas = _.pickBy(bodegas, e => e.es_principal);
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
                label='Motivo'
                label_space_xs={4}
                name='motivo'
                textField='motivo'
                placeholder='Seleccionar Motivo...'
                valuesField='detalle'
                onSelect={(e) => {
                    let solo_principales = false;
                    if (e.detalle === 'saldo_inicial' || e.detalle === 'compra') {
                        solo_principales = true;
                    }
                    setSoloBodegasPrincipales(solo_principales);
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
                label='Bodega'
                label_space_xs={4}
                name='bodega'
                textField='nombre'
                placeholder='Seleccionar Bodega...'
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
                    label='Proveedor'
                    label_space_xs={4}
                    name='proveedor'
                    textField='nombre'
                    placeholder='Seleccionar Proveedor...'
                    valuesField='id'
                    data={_.map(proveedores, h => {
                        return ({
                            id: h.id,
                            nombre: h.nombre
                        })
                    })}
                    filter='contains'
                />
            }

            <MyDateTimePickerField
                label='Fecha'
                className='col-12 col-md-6'
                name='fecha'
            />

            {
                mostrar_observacions &&
                <MyTextFieldSimple
                    label='Observación'
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
});


Form = reduxForm({
    form: "movimientosInventariosForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;