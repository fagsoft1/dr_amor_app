import React, {memo, Fragment, useState} from 'react';
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import {withStyles} from "@material-ui/core/styles/index";
import Button from '@material-ui/core/Button';


const styles = theme => (
    {
        iconoDelete: {
            color: theme.palette.primary.dark
        },
        elementNameText: {
            color: theme.palette.primary.dark,
            fontSize: '1rem'
        },
    })
;

const MyDialogButtonDelete = memo((props) => {
    const [is_open, setIsOpen] = useState(false);
    const {
        onDelete,
        element_type,
        element_name,
        classes
    } = props;
    return (
        <Fragment>
            <div className='text-center'>
                <IconButton
                    style={{
                        margin: 0,
                        padding: 4,
                    }}
                    onClick={() => setIsOpen(true)}
                >
                    <FontAwesomeIcon
                        className={classes.iconoDelete}
                        icon={['far', 'trash']}
                        size='xs'
                    />
                </IconButton>
            </div>
            <Dialog
                open={is_open}
            >
                <DialogTitle id="responsive-dialog-title">{`Eliminar ${element_type}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {` Desea eliminar ${element_type}`} <strong
                        className={classes.elementNameText}>{element_name}?</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            setIsOpen(false);
                            onDelete();
                        }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
});

MyDialogButtonDelete.propTypes = {
    element_type: PropTypes.string,
    element_name: PropTypes.string,
    onDelete: PropTypes.func
};

export default withStyles(styles, {withTheme: true})(MyDialogButtonDelete);