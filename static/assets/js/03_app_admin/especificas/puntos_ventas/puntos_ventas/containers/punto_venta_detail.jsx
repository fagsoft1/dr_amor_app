import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import {PUNTOS_VENTAS as permisos_view} from "../../../../../00_utilities/permisos/types";
import Typography from "@material-ui/core/Typography";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class PuntoVentaDetail extends Component {
    cargarDatos() {
        const {id} = this.props.match.params;
        const cargarConceptosOperacionesCaja = () => this.props.fetchConceptosOperacionesCajas();
        this.props.fetchPuntoVenta(id, {callback: cargarConceptosOperacionesCaja});
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view], {callback: () => this.cargarDatos()});
    }

    onSelectConceptoOperacionCaja(concepto_id) {
        const {id} = this.props.match.params;
        this.props.relacionarConceptoCajaCierre(id, concepto_id)
    }

    render() {
        const {object, mis_permisos, conceptos_operaciones_caja, classes} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        const conceptos_ingresos = _.pickBy(conceptos_operaciones_caja, e => e.tipo === 'I');
        const conceptos_egresos = _.pickBy(conceptos_operaciones_caja, e => e.tipo === 'E');
        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de Colaborador'>
                <Typography variant="h5" gutterBottom color="primary">
                    Detalle Punto Venta
                </Typography>
                <Paper className={classes.root} elevation={2}>
                    <div className="row" style={{fontSize: '0.6rem'}}>
                        <div className="col-12">
                            <Typography variant="h6" gutterBottom color="primary">
                                Conceptos para cierre de caja
                            </Typography>
                        </div>
                        {
                            _.size(conceptos_egresos) > 0 &&
                            <Fragment>
                                <div className="col-12 ml-2">
                                    <Typography variant="h6" gutterBottom color="primary">
                                        Egresos
                                    </Typography>
                                </div>
                                {_.map(conceptos_egresos, c => {
                                    return <div className="col-12 col-md-6 col-lg-4" key={c.id}>
                                        {c.descripcion}
                                        <Checkbox
                                            onChange={() => this.onSelectConceptoOperacionCaja(c.id)}
                                            checked={object.conceptos_operaciones_caja_cierre.includes(c.id)}
                                        />
                                    </div>
                                })}
                            </Fragment>
                        }
                        {_.size(conceptos_ingresos) > 0 &&
                        <Fragment>
                            <div className="col-12 ml-2">
                                <Typography variant="h6" gutterBottom color="primary">
                                    Ingresos
                                </Typography>
                            </div>
                            {_.map(conceptos_ingresos, c => {
                                return <div className="col-12 col-md-6 col-lg-4" key={c.id}>
                                    {c.descripcion}
                                    <Checkbox
                                        onChange={() => this.onSelectConceptoOperacionCaja(c.id)}
                                        checked={object.conceptos_operaciones_caja_cierre.includes(c.id)}
                                    />
                                </div>
                            })}
                        </Fragment>
                        }
                    </div>
                </Paper>
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        object: state.puntos_ventas[id],
        conceptos_operaciones_caja: _.pickBy(state.conceptos_operaciones_caja, e => e.grupo === 'O')
    }
}

export default withStyles(styles)(connect(mapPropsToState, actions)(PuntoVentaDetail))

