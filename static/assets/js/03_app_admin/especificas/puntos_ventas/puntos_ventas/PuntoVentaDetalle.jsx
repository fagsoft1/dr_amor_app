import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions";
import {PUNTOS_VENTAS} from "../../../../permisos";
import Typography from "@material-ui/core/Typography/index";
import ValidarPermisos from "../../../../permisos/validar_permisos";
import {makeStyles} from "@material-ui/core";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import PuntoVentaDetalleMetodoPago from './PuntoVentaDetalleMetodoPago';
import PuntoVentaDetalleConceptoOperacionCaja from './PuntoVentaDetalleConceptoOperacionCaja';
import PuntoVentaDetalleUsuario from './PuntoVentaDetalleUsuario';
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";

const useStyles = makeStyles(theme => (
    {
        root: {
            ...theme.mixins.gutters(),
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            marginTop: '5px',
        },
    })
);

const useStylesList = makeStyles(theme => (
    {
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
    })
);


const PuntoVentaDetail = memo(props => {
    const classes = useStyles();
    const classes_list = useStylesList();
    const {id} = props.match.params;
    const permisos = useTengoPermisos(PUNTOS_VENTAS);
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchPuntoVenta(id));
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearPuntosVentas());
        };
    }, [id]);

    const punto_venta = useSelector(state => state.puntos_ventas[id]);
    if (!punto_venta) {
        return <div></div>
    }
    const {
        to_string,
        bodega_nombre,
        tipo_nombre,
        usuario_actual,
        abierto,
        cuenta_contable_caja_nombre,
        usuarios,
        conceptos_operaciones_caja_punto_venta,
        metodos_pagos_punto_venta
    } = punto_venta;
    return (<ValidarPermisos can_see={permisos.detail} nombre='detalles de Punto Venta'>
        <Typography variant="h5" gutterBottom color="primary">
            Detalle Punto Venta {to_string}
        </Typography>
        <Typography variant="body1" gutterBottom color="primary">
            Bodega: {bodega_nombre}
        </Typography>
        <Typography variant="body1" gutterBottom color="primary">
            Tipo de punto venta: {tipo_nombre}
        </Typography>
        <Typography variant="body1" gutterBottom color="primary">
            Cuenta Contable: {cuenta_contable_caja_nombre}
        </Typography>
        {usuario_actual && <Typography variant="body1" gutterBottom color="primary">
            Usuario Actual: {usuario_actual}
        </Typography>}
        <div className="row">
            <div className="col-sm-12 col-md-6 col-xl-4">
                <PuntoVentaDetalleConceptoOperacionCaja
                    conceptos_operaciones_caja_punto_venta={conceptos_operaciones_caja_punto_venta}
                    id={id}
                    classes_list={classes_list} classes={classes}
                />
            </div>
            <div className="col-sm-12 col-md-6 col-xl-4">
                <PuntoVentaDetalleMetodoPago
                    metodos_pagos_punto_venta={metodos_pagos_punto_venta}
                    id={id}
                    classes_list={classes_list} classes={classes}
                />
            </div>
            <div className="col-sm-12 col-md-6 col-xl-4">
                <PuntoVentaDetalleUsuario
                    usuarios={usuarios}
                    classes_list={classes_list} classes={classes}
                />
            </div>
        </div>
        <CargarDatos
            cargarDatos={cargarDatos}
        />
    </ValidarPermisos>)
});

export default PuntoVentaDetail;

