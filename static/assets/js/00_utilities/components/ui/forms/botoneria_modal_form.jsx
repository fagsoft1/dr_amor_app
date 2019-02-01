import React from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';

const BotoneriaModalForm = (props) => {
    const {
        pristine,
        submitting,
        reset,
        initialValues = null,
        onCancel,
        mostrar_submit = true,
        mostrar_limpiar = true,
        mostrar_cancelar = true,
    } = props;
    return (
        <div>
            {
                mostrar_submit &&
                <Button
                    color="primary"
                    variant="contained"
                    type='submit'
                    className='ml-3'
                    disabled={submitting || pristine}
                >
                    {initialValues ? 'Editar ' : 'Crear '}
                </Button>
            }
            {
                mostrar_limpiar &&
                <Button
                    color="secondary"
                    variant="contained"
                    className='ml-3'
                    onClick={reset}
                    disabled={submitting || pristine}
                >
                    Limpiar
                </Button>
            }
            {
                mostrar_cancelar &&
                <Button
                    color="secondary"
                    variant="contained"
                    className='ml-3'
                    onClick={() => onCancel()}
                >
                    {submitting || pristine ? 'Cerrar' : 'Cancelar'}
                </Button>
            }
        </div>
    )
};


BotoneriaModalForm.propTypes = {
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    reset: PropTypes.func,
    initialValues: PropTypes.any,
    onCancel: PropTypes.func
};
export default BotoneriaModalForm;