const validate = values => {
    const errors = {};

    const requiredFields = [
        'valor_a_pagar',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.valor_a_pagar && parseFloat(values.valor_a_pagar) < 0) {
        errors.valor_a_pagar = 'Debe ser un valor positivo';
    }

    if (values.valor_a_pagar && parseFloat(values.valor_a_pagar) === 0) {
        errors.valor_a_pagar = 'Debe ser un valor mayor a cero';
    }
    return errors;
};

export default validate;