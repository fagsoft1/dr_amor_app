const validate = values => {
    const errors = {};

    const requiredFields = [
        'tipo',
        'grupo',
        'concepto',
        'tercero',
        'valor',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.valor && parseFloat(values.valor) < 0) {
        errors.valor = 'Debe ser un valor positivo';
    }

    if (values.valor && parseFloat(values.valor) === 0) {
        errors.valor = 'Debe ser un valor mayor a cero';
    }
    return errors;
};

export default validate;