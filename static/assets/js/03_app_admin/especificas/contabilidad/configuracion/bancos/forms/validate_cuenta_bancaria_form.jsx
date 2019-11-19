const validate = values => {
    const errors = {};

    const requiredFields = [
        'nro_cuenta',
        'titular_cuenta',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    return errors;
};

export default validate;