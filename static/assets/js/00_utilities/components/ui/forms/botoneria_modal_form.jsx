import React from 'react';
import PropTypes from "prop-types";
import {FlatIconModal} from '../icon/iconos_base';

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
                <FlatIconModal
                    text={initialValues ? 'Editar ' : 'Crear '}
                    disabled={submitting || pristine}
                    type='submit'
                />
            }
            {
                mostrar_limpiar &&
                <FlatIconModal
                    text="Limpiar"
                    disabled={submitting || pristine}
                    onClick={reset}
                />
            }
            {
                mostrar_cancelar &&
                <FlatIconModal
                    text={submitting || pristine ? 'Cerrar' : 'Cancelar'}
                    onClick={
                        () => {
                            onCancel();
                        }
                    }
                />
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