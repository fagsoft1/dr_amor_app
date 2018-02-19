import React from 'react';
import PropTypes from "prop-types";
import {MyDialogCreate} from '../../../../00_utilities/components/ui/dialog';
import BotoneriaModalForm from '../../../../00_utilities/components/ui/forms/botoneria_modal_form';

export const MyFormTagModal = (props) => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleClose,
        modal_open,
        element_type
    } = props;
    return (
        <MyDialogCreate
            element_type={`${initialValues ? 'Editar ' : 'Crear '} ${element_type}`}
            is_open={modal_open}
        >
            <form className="card p-3" onSubmit={onSubmit}>
                <div className="row">
                    {props.children}
                </div>
                <BotoneriaModalForm
                    handleClose={handleClose}
                    onCancel={onCancel}
                    pristine={pristine}
                    reset={reset}
                    submitting={submitting}
                    initialValues={initialValues}
                />
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