const validate = values => {
    const errors = {};

    const requiredFields = [
        'bodega',
        'nombre',
        'tipo',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    return errors;
};

export default validate;