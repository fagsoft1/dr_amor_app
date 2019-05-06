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
            terceros_cuentas
        } = this.props;
        const {cuenta_id} = this.state;
        return (
            <Dialog
                fullScreen={false}
                open={is_open}
            >
                <DialogTitle id="responsive-dialog-title">
                    Liquidación
                </DialogTitle>
                <DialogContent>
                    <div className="row" style={{height: '300px', width: '500px'}}>
                        {
                            _.size(terceros_cuentas) > 0 &&
                            <Fragment>
                                <div className="col-12 text-center">
                                    <Combobox
                                        data={_.map(_.orderBy(terceros_cuentas, ['tipo', 'es_acompanante', 'es_colaborador', 'nombre'], ['desc', 'desc', 'desc', 'desc']), c => {
                                            const getTipo = (c) => {
                                                if (c.tipo === 1 && c.es_acompanante) {
                                                    return 'Acompañante';
                                                } else if (c.tipo === 1 && c.es_colaborador) {
                                                    return 'Colaborador';
                                                } else if (c.tipo === 2 && c.es_colaborador) {
                                                    return 'Mesero';
                                                } else {
                                                    return 'Sin Definir'
                                                }
                                            };
                                            return (
                                                {
                                                    id: c.id,
                                                    nombre: `${getTipo(c)} - ${c.nombre} - Nro. ${c.id}`
                                                }
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