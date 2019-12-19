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

const PuntoVentaDetalleConceptoOperacionCaja = memo(props => {
    const {conceptos_operaciones_caja_punto_venta, id, classes_list, classes} = props;
    const [show_buscar_conceptos_caja, setShowBuscarConceptosCaja] = useState(false);
    const dispatch = useDispatch();
    const conceptos_operaciones_cajas = useSelector(state => state.conceptos_operaciones_caja);
    const onMountDialogSeleccionarConceptoCaja = () => {
        dispatch(actions.fetchConceptosOperacionesCajas());
    };
    const onUnMountDialogSeleccionarConceptoCaja = () => {
        dispatch(actions.clearConceptosOperacionesCajas());
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
    return (<Fragment>
        {show_buscar_conceptos_caja && <DialogSeleccionar
            excluded_id={conceptos_operaciones_caja_punto_venta.map(e => e.concepto_operacion_caja)}
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
                        {conceptos_operaciones_caja_punto_venta.length > 0 &&
                        <List dense className={classes_list.root}>
                            {conceptos_operaciones_caja_punto_venta.map(e =>
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
                        </List>}
                    </div>
                </div>
            </div>
        </Paper>
    </Fragment>)
});

export default PuntoVentaDetalleConceptoOperacionCaja;

