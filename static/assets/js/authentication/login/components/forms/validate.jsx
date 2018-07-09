const validate = values => {
    const errors = {};

    const requiredFields = [
        'username',
        'password',
        'punto_venta',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;