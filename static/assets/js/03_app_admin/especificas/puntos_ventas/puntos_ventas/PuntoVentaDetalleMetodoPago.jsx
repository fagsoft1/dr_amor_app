import React, {memo, useState, Fragment} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions";
import Typography from "@material-ui/core/Typography/index";
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

const PuntoVentaDetalleMetodoPago = memo(props => {
    const [show_buscar_metodos_pagos, setShowBuscarMetodosPagos] = useState(false);
    const {metodos_pagos_punto_venta, id, classes_list, classes} = props;
    const dispatch = useDispatch();
    const metodos_pagos = useSelector(state => state.contabilidad_metodos_pagos);
    const onMountDialogSeleccionarMetodoPago = () => {
        dispatch(actions.fetchMetodosPagos());
    };
    const onUnMountDialogSeleccionarMetodoPago = () => {
        dispatch(actions.clearMetodosPagos());
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
    return (<Fragment>
        {show_buscar_metodos_pagos && <DialogSeleccionar
            excluded_id={metodos_pagos_punto_venta.map(e => e.metodo_pago)}
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
                    {metodos_pagos_punto_venta.length > 0 &&
                    <List dense className={classes_list.root}>
                        {metodos_pagos_punto_venta.map(e =>
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
                    </List>}
                </div>
            </div>
        </Paper>
    </Fragment>)
});

export default PuntoVentaDetalleMetodoPago;

