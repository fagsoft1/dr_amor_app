import React, {memo} from 'react';
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


const MyDialogCreate = memo((props) => {
    const {
        element_type,
        is_open,
        fullScreen = true,
    } = props;
    return (
        <Dialog
            fullScreen={fullScreen}
            open={is_open}
        >
            <DialogTitle id="responsive-dialog-title">
                {element_type}
            </DialogTitle>
            <DialogContent>
                {props.children}
            </DialogContent>
        </Dialog>
    )
});

MyDialogCreate.propTypes = {
    element_type: PropTypes.string,
    is_open: PropTypes.bool
};
export default MyDialogCreate;