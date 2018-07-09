import React, {Component, Fragment} from 'react';
import PropTypes from "prop-types";
import {IconButtonTableDelete, FlatIconModalCancel, FlatIconModalDelete} from './icon/iconos';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

export class MyDialogButtonDelete extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            is_open: false,
        });
        this.setStateDialog = this.setStateDialog.bind(this);
    }

    setStateDialog(estado) {
        this.setState(estado)
    }

    render() {
        const {
            onDelete,
            element_type,
            element_name
        } = this.props;
        return (
            <Fragment>
                <IconButtonTableDelete
                    onClick={() => this.setState({is_open: true})}
                />
                <Dialog
                    open={this.state.is_open}
                >

                    <DialogTitle id="responsive-dialog-title">{`Eliminar ${element_type}`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {` Desea eliminar ${element_type} ${element_name}`}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <FlatIconModalCancel onClick={() => this.setState({is_open: false})}/>
                        <FlatIconModalDelete
                            onClick={() => {
                                this.setState({
                                    is_open: false
                                });
                                onDelete();
                            }}
                        />
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

MyDialogButtonDelete.propTypes = {
    element_type: PropTypes.string,
    element_name: PropTypes.string,
    onDelete: PropTypes.func
};


export class MyDialogCreate extends Component {
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
                <DialogTitle id="responsive-dialog-title">{element_type}</DialogTitle>
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