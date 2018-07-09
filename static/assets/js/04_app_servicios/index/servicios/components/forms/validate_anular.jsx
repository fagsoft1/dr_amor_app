const validate = values => {
    const errors = {};

    const requiredFields = [
        'observacion_anulacion',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    return errors;
};

export default validate;