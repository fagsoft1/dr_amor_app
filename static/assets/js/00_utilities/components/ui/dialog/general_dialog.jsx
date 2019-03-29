import React, {Component} from 'react';
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

class GeneralDialog extends Component {
    componentWillUnmount() {
        const {onComponentWillUnmount} = this.props;
        if (onComponentWillUnmount) {
            onComponentWillUnmount()
        }
    }

    render() {
        const {
            titulo,
            is_open,
            fullScreen = true,
            onCerrar = null,
            onOptionalAction1 = null,
            onOptionalAction2 = null,
            onOptionalAction3 = null,
            onOptionalTextButton1 = '',
            onOptionalTextButton2 = '',
            onOptionalTextButton3 = '',
        } = this.props;
        return (
            <Dialog
                fullScreen={fullScreen}
                open={is_open}
            >
                <DialogTitle id="responsive-dialog-title">
                    {titulo}
                </DialogTitle>
                <DialogContent>
                    {this.props.children}
                </DialogContent>
                <DialogActions>
                    {
                        onOptionalAction1 &&
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={onOptionalAction1}
                        >
                            {onOptionalTextButton1}
                        </Button>
                    }
                    {
                        onOptionalAction2 &&
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={onOptionalAction2}
                        >
                            {onOptionalTextButton2}
                        </Button>
                    }
                    {
                        onOptionalAction3 &&
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={onOptionalAction3}
                        >
                            {onOptionalTextButton3}
                        </Button>
                    }
                    {
                        onCerrar &&
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={onCerrar}
                        >
                            Cerrar
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        )
    }
}

GeneralDialog.propTypes = {
    onComponentWillUnmount: PropTypes.func,
    onCerrar: PropTypes.func,
    onOptionalAction1: PropTypes.func,
    onOptionalAction2: PropTypes.func,
    onOptionalAction3: PropTypes.func,
    onOptionalTextButton1: PropTypes.string,
    onOptionalTextButton2: PropTypes.string,
    onOptionalTextButton3: PropTypes.string,
    titulo: PropTypes.string.isRequired,
    is_open: PropTypes.bool.isRequired,
    children: PropTypes.element
};
export default GeneralDialog;