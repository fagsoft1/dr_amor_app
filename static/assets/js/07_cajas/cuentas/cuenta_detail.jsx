import React, {Component, Fragment} from 'react';
import {TERCEROS_CUENTAS as permisos_view} from "../../permisos";
import {connect} from "react-redux";
import * as actions from "../../01_actions/01_index";
import {permisosAdapter} from "../../00_utilities/common";
import ValidarPermisos from "../../permisos/validar_permisos";
import Button from "@material-ui/core/Button/index";
import Typography from "@material-ui/core/Typography";

class CuentaDetail extends Component {
    cargarDatos() {
        const {id} = this.props.match.params;
        this.props.fetchTerceroCuenta(id)
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view], {callback: () => this.cargarDatos()});
    }

    render() {
        const {mis_permisos, object} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        if (object && object.liquidada) {
            return <div>
                Esta cuenta ya esta liquidada
                <p>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            this.props.history.goBack()
                        }}>
                        Regresar
                    </Button>
                </p>
            </div>
        }
        return <ValidarPermisos can_see={permisos.detail} nombre='Liquidar Cuenta'>
            {
                object &&
                object.es_acompanante &&
                <Fragment>
                    <div className="col-12">
                        <Typography variant="h4" gutterBottom color="primary">
                            Cuenta de Acompañante {cuenta.nombre}
                        </Typography>
                    </div>
                </Fragment>
            }
        </ValidarPermisos>
    }
}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        object: state.terceros_cuentas[id],
    }
}

export default connect(mapPropsToState, actions)(CuentaDetail)