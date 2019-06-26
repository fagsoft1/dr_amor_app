import React, {Component, Fragment} from "react";
import QrReader from "react-qr-reader";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import Fab from '@material-ui/core/Fab';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

class QrReaderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 300,
            tercero: '',
            qr_codigo: null,
            open_modal: false,
            tipo_venta: null
        };
        this.handleScan = this.handleScan.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    handleScan(data) {
        if (data) {
            this.props.fetchTerceroxQr(data, {
                callback: (res) => {
                    this.setState({
                        tercero: res,
                        qr_codigo: data
                    });
                }
            })
        }
    }

    handleError(err) {
        console.error(err);
    }

    onCloseModal() {
        this.setState({
            open_modal: false,
            tipo_venta: null,
            tercero: '',
            qr_codigo: null
        })
    }


    render() {
        const {open_modal, tercero, qr_codigo, tipo_venta} = this.state;
        const {onSubmit, classes} = this.props;
        const error_mesero = tipo_venta === 2 && tercero.es_acompanante;
        const mostrar_lector_qr = tercero === '' && open_modal && tipo_venta;
        const mostrar_boton_cargue = tercero.full_name_proxy && !error_mesero;
        const mostrar_tipo_venta = tercero === '' && !tipo_venta;
        return (
            <Fragment>
                <Button
                    onClick={() => this.setState({open_modal: true})}
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
                                        this.setState({tipo_venta: 2});
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
                                        this.setState({tipo_venta: 3});
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
                                    delay={this.state.delay}
                                    onError={this.handleError}
                                    onScan={this.handleScan}
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
                                    this.setState({open_modal: false});
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
                            onClick={() => this.onCloseModal()}
                        >
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
});

export default withStyles(styles)(connect(null, actions)(QrReaderComponent));
