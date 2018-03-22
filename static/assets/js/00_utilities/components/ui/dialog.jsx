import React, {Component, Fragment} from 'react';
import PropTypes from "prop-types";
import Dialog from 'material-ui/Dialog';
import {IconButtonTableDelete, FlatIconModalCancel, FlatIconModalDelete} from './icon/iconos';

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
        const actions = [
            <FlatIconModalCancel onClick={() => this.setState({is_open: false})}/>,
            <FlatIconModalDelete
                onClick={() => {
                    this.setState({
                        is_open: false
                    });
                    onDelete();
                }}
            />,
        ];
        return (
            <Fragment>
                <IconButtonTableDelete
                    onClick={() => this.setState({is_open: true})}
                />
                <Dialog
                    title={`Eliminar ${element_type}`}
                    actions={actions}
                    modal={true}
                    open={this.state.is_open}
                >
                    {` Desea eliminar ${element_type} ${element_name}`}?
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
            modelStyle
        } = this.props;
        const actions = [];
        return (
            <Fragment>
                <Dialog
                    title={`${element_type}`}
                    actions={actions}
                    modal={true}
                    open={is_open}
                    autoScrollBodyContent={true}
                    contentStyle={modelStyle}
                >
                    {this.props.children}
                </Dialog>
            </Fragment>
        )
    }
}

MyDialogCreate.propTypes = {
    element_type: PropTypes.string,
    is_open: PropTypes.bool
};