import React, {memo, Fragment, useState} from 'react';
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withStyles} from "@material-ui/core/styles/index";
import Button from '@material-ui/core/Button';
import {useSelector} from "react-redux/es/hooks/useSelector";
import {fechaHoraFormatoUno} from "../../../common";
import SiNoDialog from "../../ui/dialog/SiNoDialog";

const HistoricoDialogTableData = ({serialized_data}) => {
    const object = JSON.parse(serialized_data)[0];
    const {fields} = object;
    let elementos = [];
    _.mapKeys(fields, (v, k) => elementos = [...elementos, {nombre: k, valor: v}]);
    return <div>{elementos.map(e => <div key={e.nombre}><strong>{e.nombre}:</strong> {e.valor}</div>)}</div>
};

const HistoricoDialogTableTD = props => {
    const [show_restaurar_si_no, setRestaurarSiNo] = useState(false);
    const {item, item: {revision: {username, date_created, comment}, serialized_data, object_id}, onRestoreItem} = props;
    return <Fragment>
        {show_restaurar_si_no &&
        <SiNoDialog
            onSi={() => {
                onRestoreItem(object_id, item.id, {callback: () => setRestaurarSiNo(false)})
            }}
            onNo={() => setRestaurarSiNo(false)}
            is_open={show_restaurar_si_no}
            titulo='Restaurar Versión'
        >
            Desea restaurar a esta versión?
            <HistoricoDialogTableData serialized_data={serialized_data}/>
        </SiNoDialog>}
        <tr>
            <td>{item.id}</td>
            <td>{fechaHoraFormatoUno(date_created)}</td>
            <td>{username}</td>
            <td>{comment}</td>
            <td><HistoricoDialogTableData serialized_data={serialized_data}/></td>
            <td>{onRestoreItem &&
            <span className='puntero' onClick={() => setRestaurarSiNo(true)}>Restaurar</span>}</td>
        </tr>
    </Fragment>
};

const HistoricoDialog = memo((props) => {
    const historicos = _.orderBy(useSelector(state => state.historicos), ['id'], ['desc']);
    const {
        element_type,
        onRestoreItem,
        is_open,
        onCancel,
    } = props;
    return (
        <Fragment>
            <Dialog
                open={is_open}
            >
                <DialogTitle id="responsive-dialog-title">{`Historico de ${element_type}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    </DialogContentText>
                    <table className='table table-responsive table-striped'>
                        <thead>
                        <tr>
                            <th>Version Id</th>
                            <th>Fecha</th>
                            <th>Usuario</th>
                            <th>Comentario</th>
                            <th>Datos</th>
                        </tr>
                        </thead>
                        <tbody>
                        {_.map(historicos, h => <HistoricoDialogTableTD
                            onRestoreItem={onRestoreItem}
                            key={h.id}
                            item={h}/>
                        )}
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={onCancel}
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
});

HistoricoDialog.propTypes = {
    element_type: PropTypes.string,
    element_name: PropTypes.string,
    //onDelete: PropTypes.func
};

export default HistoricoDialog;