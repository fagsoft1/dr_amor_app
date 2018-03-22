import React from 'react';
import PropTypes from "prop-types";
import {FlatIconModal} from '../icon/iconos_base';

const BotoneriaModalForm = (props) => {
    const {
        pristine,
        submitting,
        reset,
        initialValues = null,
        onCancel
    } = props;
    return (
        <div>
            <FlatIconModal
                text={initialValues ? 'Editar ' : 'Crear '}
                primary={true}
                disabled={submitting || pristine}
                type='submit'
            />
            <FlatIconModal
                text="Limpiar"
                primary={false}
                disabled={submitting || pristine}
                onClick={reset}
            />
            <FlatIconModal
                text={submitting || pristine ? 'Cerrar' : 'Cancelar'}
                primary={false}
                onClick={
                    () => {
                        onCancel();
                    }
                }
            />
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