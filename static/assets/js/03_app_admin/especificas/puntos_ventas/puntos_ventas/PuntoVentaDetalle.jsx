import React, {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions";
import {PUNTOS_VENTAS} from "../../../../permisos";
import Typography from "@material-ui/core/Typography/index";
import ValidarPermisos from "../../../../permisos/validar_permisos";
import {makeStyles} from "@material-ui/core";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import Paper from '@material-ui/core/Paper/index';
import DialogSeleccionar from "../../../../00_utilities/components/ui/search_and_select/SearchAndSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import MyDialogButtonDelete from "../../../../00_utilities/components/ui/dialog/DeleteDialog";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";

const useStyles = makeStyles(theme => (
    {
        root: {
            ...theme.mixins.gutters(),
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            marginTop: '5px'
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
    const classesList = useStylesList();
    const [show_buscar_conceptos_caja, setShowBuscarConceptosCaja] = useState(false);
    const [show_buscar_metodos_pagos, setShowBuscarMetodosPagos] = useState(false);
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
    const conceptos_operaciones_cajas = useSelector(state => state.conceptos_operaciones_caja);
    const metodos_pagos = useSelector(state => state.contabilidad_metodos_pagos);
    if (!punto_venta) {
        return <div></div>
    }
    const onMountDialogSeleccionarConceptoCaja = () => {
        dispatch(actions.fetchConceptosOperacionesCajas());
    };
    const onUnMountDialogSeleccionarConceptoCaja = () => {
        dispatch(actions.clearConceptosOperacionesCajas());
    };
    const onMountDialogSeleccionarMetodoPago = () => {
        dispatch(actions.fetchMetodosPagos());
    };
    const onUnMountDialogSeleccionarMetodoPago = () => {
        dispatch(actions.clearMetodosPagos());
    };
    const onSelectConceptoCaja = (concepto_operacion_caja_id) => {
        dispatch(actions.relacionarConceptoCajaPuntoVenta(id, concepto_operacion_caja_id));
    };
    const onDeleteConceptoCaja = (concepto_operacion_caja_id) => {
        dispatch(actions.quitarConceptoCajaPuntoVenta(id, concepto_operacion_caja_id));
    };
    const onCheckConceptoCaja = (concepto_operacion_caja_id, valor) => {
        dispatch(actions.setCierreConceptoCajaPuntoVenta(id, concepto_operacion_caja_id, valor));
    };
    const onCheckMetodoPago = (metodo_pago_id, valor) => {
        dispatch(actions.setActivoMetodoPagoPuntoVenta(id, metodo_pago_id, valor));
    };
    const onSelectMetodoPago = (metodo_pago_id) => {
        dispatch(actions.relacionarMetodoPagoPuntoVenta(id, metodo_pago_id));
    };
    const onDeleteMetodoPago = (metodo_pago_id) => {
        dispatch(actions.quitarMetodoPagoPuntoVenta(id, metodo_pago_id));
    };
    const {to_string, bodega_nombre, tipo_nombre, usuario_actual, abierto, cuenta_contable_caja_nombre} = punto_venta;
    return (
        <ValidarPermisos can_see={permisos.detail} nombre='detalles de Punto Venta'>
            {show_buscar_conceptos_caja && <DialogSeleccionar
                excluded_id={punto_venta.conceptos_operaciones_caja_punto_venta.map(e => e.concepto_operacion_caja)}
                min_caracteres={0}
                style_items='list'
                placeholder='Concepto Caja a Buscar'
                id_text='id'
                selected_item_text='to_string'
                onSelect={id => onSelectConceptoCaja(id)}
                listado={_.map(_.orderBy(conceptos_operaciones_cajas, ['tipo'], ['desc']))}
                open={show_buscar_conceptos_caja}
                select_boton_text='Relacionar'
                titulo_modal='Relacionar Operacion Caja'
                onMount={onMountDialogSeleccionarConceptoCaja}
                onUnMount={onUnMountDialogSeleccionarConceptoCaja}
                onCancelar={() => setShowBuscarConceptosCaja(false)}
            />}
            {show_buscar_metodos_pagos && <DialogSeleccionar
                excluded_id={punto_venta.metodos_pagos_punto_venta.map(e => e.metodo_pago)}
                min_caracteres={0}
                style_items='list'
                placeholder='Metodo a Buscar'
                id_text='id'
                selected_item_text='to_string'
                onSelect={id => onSelectMetodoPago(id)}
                listado={_.map(metodos_pagos)}
                open={show_buscar_metodos_pagos}
                select_boton_text='Relacionar'
                titulo_modal='Relacionar Metodo Pago'
                onMount={onMountDialogSeleccionarMetodoPago}
                onUnMount={onUnMountDialogSeleccionarMetodoPago}
                onCancelar={() => setShowBuscarMetodosPagos(false)}
            />}
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
                    <Paper className={classes.root} elevation={2}>
                        <div className="row" style={{fontSize: '0.6rem'}}>
                            <div className="col-12">
                                <div className="col-12">
                                    <Typography variant="h6" gutterBottom color="primary">
                                        Operaciones de Caja
                                    </Typography>
                                </div>
                                <FontAwesomeIcon
                                    className='puntero'
                                    size='lg'
                                    icon={['far', 'plus-circle']}
                                    onClick={() => setShowBuscarConceptosCaja(true)}
                                    style={{position: 'absolute', right: 10, top: 10}}
                                />
                                <div className="col-12">
                                    {punto_venta.conceptos_operaciones_caja_punto_venta.length > 0 &&
                                    <List dense className={classesList.root}>
                                        {punto_venta.conceptos_operaciones_caja_punto_venta.map(e =>
                                            <ListItem key={e.id} button>
                                                <ListItemIcon>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={e.para_cierre_caja}
                                                                color='primary'
                                                                onChange={(event, value) => onCheckConceptoCaja(e.concepto_operacion_caja, value)}
                                                                tabIndex={-1}
                                                                edge="start"
                                                                disableRipple
                                                                inputProps={{'aria-labelledby': e.id}}
                                                            />
                                                        }
                                                        label={'Cierre'}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText id={e.id}
                                                              primary={e.concepto_operacion_caja_descripcion}/>
                                                <ListItemSecondaryAction>
                                                    <MyDialogButtonDelete
                                                        onDelete={() => {
                                                            onDeleteConceptoCaja(e.concepto_operacion_caja)
                                                        }}
                                                        element_name={e.concepto_operacion_caja_descripcion}
                                                        element_type='Concepto Operación Caja'
                                                    />
                                                </ListItemSecondaryAction>
                                            </ListItem>)}
                                    </List>
                                    }
                                </div>
                            </div>
                        </div>
                    </Paper>
                </div>
                <div className="col-sm-12 col-md-6 col-xl-4">
                    <Paper className={classes.root} elevation={2}>
                        <div className="row" style={{fontSize: '0.6rem'}}>
                            <div className="col-12">
                                <Typography variant="h6" gutterBottom color="primary">
                                    Métodos de pago
                                </Typography>
                                <FontAwesomeIcon
                                    className='puntero'
                                    size='lg'
                                    icon={['far', 'plus-circle']}
                                    onClick={() => setShowBuscarMetodosPagos(true)}
                                    style={{position: 'absolute', right: 10, top: 10}}
                                />
                            </div>
                            <div className="col-12">
                                {punto_venta.metodos_pagos_punto_venta.length > 0 &&
                                <List dense className={classesList.root}>
                                    {punto_venta.metodos_pagos_punto_venta.map(e =>
                                        <ListItem key={e.id} button>
                                            <ListItemIcon>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={e.activo}
                                                            color='primary'
                                                            onChange={(event, value) => onCheckMetodoPago(e.metodo_pago, value)}
                                                            tabIndex={-1}
                                                            edge="start"
                                                            disableRipple
                                                            inputProps={{'aria-labelledby': e.id}}
                                                        />
                                                    }
                                                    label={'Activo'}
                                                />
                                            </ListItemIcon>
                                            <ListItemText id={e.id}
                                                          primary={e.metodo_pago_descripcion}/>
                                            <ListItemSecondaryAction>
                                                <MyDialogButtonDelete
                                                    onDelete={() => {
                                                        onDeleteMetodoPago(e.metodo_pago)
                                                    }}
                                                    element_name={e.metodo_pago_descripcion}
                                                    element_type='Metodo Pago'
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>)}
                                </List>
                                }
                            </div>
                        </div>
                    </Paper>
                </div>
            </div>
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </ValidarPermisos>
    )
});

export default PuntoVentaDetail;

