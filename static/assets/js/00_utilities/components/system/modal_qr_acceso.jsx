import React, {Component, Fragment} from 'react';
import QRCode from 'qrcode-react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";

class QrIdentificacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open_modal: false
        };
    }

    onClickOpenModal() {
        const {auth: {user: {tercero}}} = this.props;
        const cargarCuenta = () => this.props.loadUser({callback: () => this.setState({open_modal: true})});
        this.props.generaQrTercero(tercero, {callback: cargarCuenta})
    }

    render() {
        const {auth: {user: {qr_acceso}}} = this.props;
        const {open_modal} = this.state;
        return (
            <Fragment>
                <Button
                    onClick={() => this.onClickOpenModal()}
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
                            onClick={() => this.setState({open_modal: false})}
                        >
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth
    }
}

export default connect(mapPropsToState, actions)(QrIdentificacion)