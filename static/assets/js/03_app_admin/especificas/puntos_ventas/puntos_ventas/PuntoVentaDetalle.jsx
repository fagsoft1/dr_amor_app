import React, {memo, Fragment, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {PUNTOS_VENTAS as permisos_view} from "../../../../00_utilities/permisos/types";
import Typography from "@material-ui/core/Typography/index";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../00_utilities/common";
import Checkbox from '@material-ui/core/Checkbox/index';
import Paper from '@material-ui/core/Paper/index';
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

const PuntoVentaDetail = memo((props) => {
    const {classes} = props;
    const punto_venta_id = props.match.params.id;
    const punto_venta = useSelector(state => state.puntos_ventas[punto_venta_id]);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const conceptos_operaciones_caja = _.pickBy(useSelector(state => state.conceptos_operaciones_caja), e => e.grupo === 'O');
    const permisos = permisosAdapter(mis_permisos, permisos_view);
    const conceptos_ingresos = _.pickBy(conceptos_operaciones_caja, e => e.tipo === 'I');
    const conceptos_egresos = _.pickBy(conceptos_operaciones_caja, e => e.tipo === 'E');
    const dispatch = useDispatch();
    const cargarDatos = () => {
        const cargarConceptosOperacionesCaja = () => dispatch(actions.fetchConceptosOperacionesCajas());
        dispatch(actions.fetchPuntoVenta(punto_venta_id, {callback: cargarConceptosOperacionesCaja}));
    };
    const onSelectConceptoOperacionCaja = (concepto_id) => {
        dispatch(actions.relacionarConceptoCajaCierre(punto_venta_id, concepto_id))
    };

    useEffect(() => {
        dispatch(actions.fetchMisPermisosxListado([permisos_view], {callback: cargarDatos}));
        return () => {
            dispatch(actions.clearConceptosOperacionesCajas());
        };
    }, []);

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
                                        onChange={() => onSelectConceptoOperacionCaja(c.id)}
                                        checked={punto_venta.conceptos_operaciones_caja_cierre.includes(c.id)}
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
                                    onChange={() => onSelectConceptoOperacionCaja(c.id)}
                                    checked={punto_venta.conceptos_operaciones_caja_cierre.includes(c.id)}
                                />
                            </div>
                        })}
                    </Fragment>
                    }
                </div>
            </Paper>
            <CargarDatos cargarDatos={cargarDatos}/>
        </ValidarPermisos>
    )
});

export default withStyles(styles)(PuntoVentaDetail)

