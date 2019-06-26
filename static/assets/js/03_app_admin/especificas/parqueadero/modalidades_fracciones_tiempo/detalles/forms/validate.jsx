const validate = values => {
    const errors = {};

    const requiredFields = [
        'minutos',
        'valor',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.minutos && values.minutos < 0) {
        errors.minutos = 'Los minutos deben de ser un número positivo mayor a 0';
    }

    if (values.valor && values.valor <= 0) {
        errors.valor = 'El valor deben de ser un número positivo';
    }
    return errors;
};

export default validate;