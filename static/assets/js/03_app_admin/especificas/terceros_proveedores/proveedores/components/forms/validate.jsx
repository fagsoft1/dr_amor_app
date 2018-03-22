const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'nro_identificacion',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;