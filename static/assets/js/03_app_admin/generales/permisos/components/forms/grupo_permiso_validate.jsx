const validate = values => {
    const errors = {};
    if (!values.name) {
        errors.name = 'Requerido';
    }
    return errors;
};

export default validate;