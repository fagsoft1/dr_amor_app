import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography/index";
import DetalleCuenta from '../../cuentas/cuenta_conceptos';
import ModalLiquidacion from '../../liquidar_cuenta/liquidacion_acompanante/liquidacion_acompanante_modal_liquidar';
import Button from "@material-ui/core/Button/index";
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {TERCEROS_CUENTAS as permisos_view} from "../../../00_utilities/permisos/types";

const styles = {
    table: {
        fontSize: '0.7rem',
        td: {
            padding: '0',
            margin: '0',
            paddingLeft: '3px',
            paddingRight: '3px',
            border: '1px solid black'
        },
        td_right: {
            padding: '0',
            margin: '0',
            paddingRight: '3px',
            paddingLeft: '3px',
            textAlign: 'right',
            border: '1px solid black'
        },
        td_total: {
            padding: '0',
            margin: '0',
            paddingRight: '3px',
            paddingLeft: '3px',
            textAlign: 'right',
            borderBottom: 'double 3px'
        },
        tr: {
            padding: '0',
            margin: '0',
        }
    },
};

class LiquidacionAcompanante extends Component {
    constructor(props) {
        super(props);
        this.state = {modal_liquidacion_open: false};
        this.onLiquidarCuenta = this.onLiquidarCuenta.bind(this);
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        this.props.fetchTerceroCuenta(id)
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view], {callback: () => this.cargarDatos()});
    }

    onLiquidarCuenta(valor_efectivo) {
        const {id} = this.props.match.params;
        const {cuenta: {tipo_cuenta}} = this.props;
        const callback = (res) => this.props.history.push(`/app/servicios/liquidacion/detail/${res.liquidacion_id}`);
        if (tipo_cuenta === 'A') {
            this.props.liquidarCuentaAcompananteTerceroCuenta(id, valor_efectivo, {callback});
        } else if (tipo_cuenta === 'M') {
            this.props.liquidarCuentaMeseroTerceroCuenta(id, valor_efectivo, {callback})
        }
    }

    render() {
        const {cuenta} = this.props;
        const {modal_liquidacion_open} = this.state;
        if (!cuenta) {
            return <div>Cargando...</div>
        }
        const {tipo_cuenta} = cuenta;
        const tipo_cuenta_titulo = tipo_cuenta === 'A' ? 'Acompañante' : (tipo_cuenta === 'M' ? 'Mesero' : 'Colaborador');
        return (
            <div className='row'>
                <div className="col-12">
                    <Typography variant="h4" gutterBottom color="primary">
                        Liquidar Cuenta para {tipo_cuenta_titulo} {cuenta.nombre}
                    </Typography>
                </div>
                {
                    modal_liquidacion_open &&
                    <ModalLiquidacion
                        onCancel={() => this.setState(s => ({modal_liquidacion_open: !s.modal_liquidacion_open}))}
                        modal_open={modal_liquidacion_open}
                        styles={styles}
                        cuenta={cuenta}
                        onSubmit={(v) => this.onLiquidarCuenta(v.valor)}
                    />
                }
                <DetalleCuenta cuenta={cuenta}/>
                <div className="col-12">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => this.setState(s => ({modal_liquidacion_open: !s.modal_liquidacion_open}))}
                    >
                        Iniciar Liquidación
                    </Button>
                </div>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        cuenta: state.terceros_cuentas[id],
    }
}

export default connect(mapPropsToState, actions)(LiquidacionAcompanante)