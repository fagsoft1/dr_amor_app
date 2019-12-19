import React, {useState} from 'react';
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {makeStyles} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

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
        children,
        on_si_texto = 'Sí',
        on_no_texto = 'No',
        texto_verificacion_comprobacion = null,
    } = props;
    const [texto_verificacion, setTextoVerificacion] = useState('');
    const valido = texto_verificacion_comprobacion ? texto_verificacion_comprobacion === texto_verificacion : true;
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
                {texto_verificacion_comprobacion && <div className='row'>
                    <div className="col-12 col-md-6 pt-2">
                        Texto verificación:
                        <Typography variant="h5" color="primary" noWrap>
                            {texto_verificacion_comprobacion}
                        </Typography>
                    </div>
                    <div className="col-12 col-md-6">
                        <TextField
                            onChange={e => setTextoVerificacion(e.target.value)}
                            label='Texto Verificación'
                            placeholder='Digite el texto de Verificación...'
                            margin="normal"

                        />
                    </div>
                </div>}
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onSi}
                    disabled={!valido}
                >
                    {on_si_texto}
                    <FontAwesomeIcon
                        className={clsx(classes.rightIcon, classes.iconSmall)}
                        icon='thumbs-up'
                        size='lg'
                    />
                </Button>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={onNo}
                >
                    {on_no_texto}
                    <FontAwesomeIcon
                        className={clsx(classes.rightIcon, classes.iconSmall)}
                        icon='thumbs-down'
                        size='lg'
                    />
                </Button>
            </DialogActions>
        </Dialog>
    )
};

SiNoDialog.propTypes = {
    on_si_texto: PropTypes.string,
    on_no_texto: PropTypes.string,
    texto_verificacion_comprobacion: PropTypes.string,
    onSi: PropTypes.func,
    onNo: PropTypes.func,
    titulo: PropTypes.string,
    is_open: PropTypes.bool
};
export default SiNoDialog;