import React, {memo, Fragment, useState} from "react";
import QrReader from "react-qr-reader";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {useDispatch} from "react-redux";
import * as actions from "../../../01_actions";
import Fab from '@material-ui/core/Fab';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const QrReaderComponent = memo(props => {
    const dispatch = useDispatch();
    const [tercero, setTercero] = useState('');
    const [qr_codigo, setQrCodigo] = useState(null);
    const [open_modal, setOpenModal] = useState(false);
    const [tipo_venta, setTipoVenta] = useState(null);

    const handleScan = (data) => {
        if (data) {
            dispatch(
                actions.fetchTerceroxQr(data, {
                    callback: (res) => {
                        setTercero(res);
                        setQrCodigo(data);
                    }
                })
            )
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    const onCloseModal = () => {
        setOpenModal(false);
        setTipoVenta(null);
        setTercero('');
        setQrCodigo(null);
    };

    const {onSubmit, classes} = props;
    const error_mesero = tipo_venta === 2 && tercero.es_acompanante;
    const mostrar_lector_qr = tercero === '' && open_modal && tipo_venta;
    const mostrar_boton_cargue = tercero.full_name_proxy && !error_mesero;
    const mostrar_tipo_venta = tercero === '' && !tipo_venta;
    return (
        <Fragment>
            <Button
                onClick={() => setOpenModal(true)}
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
                <DialogTitle>
                    {
                        mostrar_tipo_venta &&
                        <Fragment>Tipo de Venta</Fragment>
                    }
                    {
                        mostrar_boton_cargue &&
                        <Fragment>Cargar Venta</Fragment>
                    }
                    {
                        mostrar_lector_qr &&
                        <Fragment>
                            Código QR de pago
                        </Fragment>
                    }
                </DialogTitle>
                <DialogContent>
                    {
                        mostrar_tipo_venta &&
                        <Fragment>
                            <Fab
                                color="primary"
                                variant="extended"
                                className={classes.margin}
                                onClick={() => {
                                    setTipoVenta(2);
                                }}
                            >
                                <FontAwesomeIcon
                                    className={classes.extendedIcon}
                                    icon={['far', 'utensils']}
                                    size='2x'
                                />
                                Mesero
                            </Fab>
                            <Fab
                                color="primary"
                                variant="extended"
                                className={classes.margin}
                                onClick={() => {
                                    setTipoVenta(3);
                                }}
                            >
                                <FontAwesomeIcon
                                    className={classes.extendedIcon}
                                    icon={['far', 'users']}
                                    size='2x'
                                />
                                Colaborador o Acompañante
                            </Fab>
                        </Fragment>
                    }
                    {
                        mostrar_lector_qr &&
                        <Fragment>
                            <QrReader
                                delay={300}
                                onError={handleError}
                                onScan={handleScan}
                                style={{width: "250px"}}
                            />
                        </Fragment>
                    }
                    {
                        mostrar_boton_cargue &&
                        <Button
                            color="secondary"
                            variant="contained"
                            className='ml-3'
                            onClick={() => {
                                setOpenModal(false);
                                onSubmit(qr_codigo, tercero.id, tipo_venta);
                            }}
                        >
                            Cargar a {tercero.full_name_proxy}
                        </Button>
                    }
                    {
                        error_mesero &&
                        <Typography variant="overline" gutterBottom style={{color: 'red'}}>
                            Se ha tratado de cargar una venta de mesero a {tercero.full_name_proxy}
                        </Typography>

                    }
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        variant="contained"
                        className='ml-3'
                        onClick={() => onCloseModal()}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
});

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
});

export default withStyles(styles)(QrReaderComponent);
