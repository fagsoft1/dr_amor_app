import React, {Component} from 'react';
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


class MyDialogCreate extends Component {
    render() {
        const {
            element_type,
            is_open,
            fullScreen = true,
        } = this.props;
        return (
            <Dialog
                fullScreen={fullScreen}
                open={is_open}
            >
                <DialogTitle id="responsive-dialog-title">
                    {element_type}
                </DialogTitle>
                <DialogContent>
                    {this.props.children}
                </DialogContent>
            </Dialog>
        )
    }
}

MyDialogCreate.propTypes = {
    element_type: PropTypes.string,
    is_open: PropTypes.bool
};
export default MyDialogCreate;