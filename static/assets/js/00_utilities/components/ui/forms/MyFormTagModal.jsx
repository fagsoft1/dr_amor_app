import React from 'react';
import PropTypes from "prop-types";
import MyDialogCreate from '../../../../00_utilities/components/ui/dialog/create_dialog';
import BotoneriaModalForm from '../../../../00_utilities/components/ui/forms/botoneria_modal_form';
import Typography from '@material-ui/core/Typography';

export const MyFormTagModal = (props) => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        modal_open,
        element_type,
        fullScreen = true,
        modelStyle,
        mostrar_submit = true,
        mostrar_limpiar = true,
        mostrar_cancelar = true,
        error = null
    } = props;
    return (
        <MyDialogCreate
            element_type={`${initialValues ? 'Editar ' : 'Crear '} ${element_type}`}
            is_open={modal_open}
            fullScreen={fullScreen}
            modelStyle={modelStyle}
        >
            <form onSubmit={onSubmit}>
                <div className="row pl-3 pr-5">
                    {props.children}
                </div>
                <div className='mt-3'>
                    <Typography variant="caption" gutterBottom color="error">
                        {error && <strong>{error}</strong>}
                    </Typography>
                </div>
                <div className='p-3'>
                    <BotoneriaModalForm
                        mostrar_submit={mostrar_submit}
                        mostrar_limpiar={mostrar_limpiar}
                        mostrar_cancelar={mostrar_cancelar}
                        onCancel={onCancel}
                        pristine={pristine}
                        reset={reset}
                        submitting={submitting}
                        initialValues={initialValues}
                    />
                </div>
            </form>
        </MyDialogCreate>
    )
};
MyFormTagModal.propTypes = {
    element_type: PropTypes.string,
    onSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    onCancel: PropTypes.func,
    modal_open: PropTypes.bool,
    reset: PropTypes.func,
    initialValues: PropTypes.any,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
};

export default MyFormTagModal;