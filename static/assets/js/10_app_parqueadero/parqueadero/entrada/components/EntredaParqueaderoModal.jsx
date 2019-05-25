import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {reduxForm, formValueSelector} from "redux-form";
import validate from "./validate";
import {connect} from "react-redux";
import {MyCombobox, MyTextFieldSimple} from "../../../../00_utilities/components/ui/forms/fields";

class EntradaDialog extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.props.fetchTiposVehiculos();
    }

    componentWillUnmount() {
        this.props.clearTiposVehiculos();
        this.props.clearModalidadesFraccionesTiempos();
    }

    onSubmit(v) {
        this.props.createRegistroEntradaParqueo(v, {callback: () => this.props.onCerrar()})
    }

    onSelectTipoVehiculo(v) {
        const {id} = v;
        this.props.clearModalidadesFraccionesTiempos();
        this.props.fetchModalidadesFraccionesTiempos_por_tipo_vehiculo(id);
    }

    render() {
        const {
            is_open,
            handleSubmit,
            onCerrar = null,
            tipos_vehiculos,
            modalidades_fracciones_tiempo
        } = this.props;
        return (
            <Dialog
                fullScreen={false}
                open={is_open}
            >
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <DialogTitle id="responsive-dialog-title">
                        Entrada Parqueadero
                    </DialogTitle>
                    <DialogContent style={{height: '300px', width:'400px'}}>
                        <MyCombobox
                            className="col-12"
                            nombre='Tipo Vehículo'
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
                            onSelect={v => this.onSelectTipoVehiculo(v)}
                        />
                        <MyCombobox
                            className="col-12"
                            nombre='Modalidad Tiempo'
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
                            nombre='Placa'
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
    }
}

const selector = formValueSelector('entradaParqueaderoForm');

function mapPropsToState(state, ownProps) {
    return {
        valores: selector(state, 'tipo_vehiculo', 'modalidad_fraccion_tiempo')
    }
}

EntradaDialog = reduxForm({
    form: "entradaParqueaderoForm",
    validate,
    enableReinitialize: true
})(EntradaDialog);

EntradaDialog = (connect(mapPropsToState, null)(EntradaDialog));

export default EntradaDialog;