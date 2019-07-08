import React, {Fragment, memo, useState} from 'react';
import QRCode from 'qrcode-react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions";

const QrIdentificacion = memo(props => {
    const [open_modal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const {user: {tercero, qr_acceso}} = auth;
    const onClickOpenModal = () => {
        const cargarCuenta = () => dispatch(actions.loadUser({callback: () => setOpenModal(true)}));
        dispatch(actions.generaQrTercero(tercero, {callback: cargarCuenta}));
    };
    return (
        <Fragment>
            <Button
                onClick={() => onClickOpenModal()}
                color='primary'
            >
                <FontAwesomeIcon
                    icon={['far', 'qrcode']}
                    size='2x'
                />
            </Button>
            <Dialog
                fullScreen={false}
                open={open_modal}
            >
                <DialogContent>
                    <QRCode value={qr_acceso} size={180}/>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        variant="contained"
                        className='ml-3'
                        onClick={() => setOpenModal(false)}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
});

export default QrIdentificacion;