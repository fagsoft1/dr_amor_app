import React, {memo, useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {reduxForm, formValueSelector} from "redux-form";
import validate from "./validate";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../../../01_actions';
import {MyCombobox, MyTextFieldSimple} from "../../../../00_utilities/components/ui/forms/fields";

const selector = formValueSelector('entradaParqueaderoForm');

let EntradaDialog = memo((props) => {
    const {
        is_open,
        handleSubmit,
        onCerrar = null
    } = props;
    const valores = useSelector(state => selector(state, 'tipo_vehiculo', 'modalidad_fraccion_tiempo'));
    const onSubmit = (v) => {
        dispatch(actions.createRegistroEntradaParqueo(v, {callback: () => onCerrar()}));
    };
    const tipos_vehiculos = useSelector(state => state.parqueadero_tipos_vehiculos);
    const modalidades_fracciones_tiempo = useSelector(state => state.parqueadero_modalidades_fracciones_tiempo);

    const onSelectTipoVehiculo = (v) => {
        const {id} = v;
        dispatch(actions.clearModalidadesFraccionesTiempos());
        dispatch(actions.fetchModalidadesFraccionesTiempos_por_tipo_vehiculo(id));
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.fetchTiposVehiculos());
        return () => {
            dispatch(actions.clearTiposVehiculos());
            dispatch(actions.clearModalidadesFraccionesTiempos());
        }
    }, []);

    return (
        <Dialog
            fullScreen={false}
            open={is_open}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle id="responsive-dialog-title">
                    Entrada Parqueadero
                </DialogTitle>
                <DialogContent style={{height: '300px', width: '400px'}}>
                    <MyCombobox
                        className="col-12"
                        label='Tipo Vehículo'
                        label_space_xs={4}
                        placeholder='Seleccionar tipo de vehiculo...'
                        name='tipo_vehiculo'
                        textField='nombre'
                        valuesField='id'
                        data={_.map(tipos_vehiculos, h => {
                            return ({
                                id: h.id,
                                nombre: h.nombre
                            })
                        })}
                        filter='contains'
                        onSelect={v => onSelectTipoVehiculo(v)}
                    />
                    <MyCombobox
                        className="col-12"
                        label='Modalidad Tiempo'
                        label_space_xs={4}
                        placeholder='Seleccionar Modalidad Tiempo...'
                        name='modalidad_fraccion_tiempo'
                        textField='nombre'
                        valuesField='id'
                        data={_.map(modalidades_fracciones_tiempo, h => {
                            return ({
                                id: h.id,
                                nombre: h.nombre
                            })
                        })}
                        filter='contains'
                    />
                    <MyTextFieldSimple
                        className="col-12"
                        label='Placa'
                        name='placa'
                        case='U'
                    />

                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        type='submit'
                    >
                        Registrar
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={onCerrar}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
});

EntradaDialog = reduxForm({
    form: "entradaParqueaderoForm",
    validate,
    enableReinitialize: true
})(EntradaDialog);

export default EntradaDialog;