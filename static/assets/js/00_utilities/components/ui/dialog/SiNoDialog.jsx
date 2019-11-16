import React from 'react';
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
}));

const SiNoDialog = (props) => {
    const classes = useStyles();
    const {
        titulo,
        is_open,
        onSi,
        onNo,
        children
    } = props;
    return (
        <Dialog
            fullScreen={false}
            open={is_open}
        >
            <DialogTitle id="responsive-dialog-title">
                {titulo}
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onSi}
                >
                    Sí
                    <FontAwesomeIcon
                        className={clsx(classes.rightIcon, classes.iconSmall)}
                        icon={['far', 'thumbs-up']}
                        size='lg'
                    />
                </Button>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={onNo}
                >
                    No
                    <FontAwesomeIcon
                        className={clsx(classes.rightIcon, classes.iconSmall)}
                        icon={['far', 'thumbs-down']}
                        size='lg'
                    />
                </Button>
            </DialogActions>
        </Dialog>
    )
};

SiNoDialog.propTypes = {
    onSi: PropTypes.func,
    onNo: PropTypes.func,
    titulo: PropTypes.string,
    is_open: PropTypes.bool
};
export default SiNoDialog;