import React, {Component, Fragment} from 'react';
import Dialog from "@material-ui/core/Dialog/index";
import DialogTitle from "@material-ui/core/DialogTitle/index";
import DialogContent from "@material-ui/core/DialogContent/index";
import DialogActions from "@material-ui/core/DialogActions/index";
import Button from "@material-ui/core/Button/index";
import {connect} from "react-redux";
import * as actions from "../../01_actions/01_index";
import Combobox from "react-widgets/lib/Combobox";


class LiquidacionOpciones extends Component {
    constructor(prop) {
        super(prop);
        this.state = {cuenta_id: ""}
    }

    componentDidMount() {
        this.props.fetchTercerosCuentasSinLiquidar()
    }

    render() {
        const {
            is_open,
            onCancel,
            history,
            terceros_cuentas
        } = this.props;
        const {cuenta_id} = this.state;
        const cuentas_acompanantes = _.pickBy(
            terceros_cuentas, e => e.es_acompanante === true
        );
        return (
            <Dialog
                fullScreen={false}
                open={is_open}
            >
                <DialogTitle id="responsive-dialog-title">
                    Liquidación
                </DialogTitle>
                <DialogContent>
                    <div className="row" style={{height: '300px'}}>
                        {
                            _.size(cuentas_acompanantes) > 0 &&
                            <Fragment>
                                <div className="col-12 text-center">
                                    <Combobox
                                        data={_.map(cuentas_acompanantes, c => {
                                            return (
                                                {id: c.id, nombre: `${c.nombre} - Nro. ${c.id}`}
                                            )
                                        })}
                                        filter='contains'
                                        placeholder='Seleccionar Cuenta...'
                                        valueField='id'
                                        textField='nombre'
                                        onSelect={(e) => this.setState({cuenta_id: e.id})}
                                    />
                                </div>
                            </Fragment>
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            this.props.history.push(`/app/servicios/liquidar_cuenta/detail/${cuenta_id}`)
                        }}>
                        Ir a Liquidar
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        className='ml-3'
                        onClick={() => onCancel()}
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        terceros_cuentas: state.terceros_cuentas
    }
}

export default connect(mapPropsToState, actions)(LiquidacionOpciones)