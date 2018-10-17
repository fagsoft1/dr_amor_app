const validate = values => {
    const errors = {};

    const requiredFields = [
        'valor_tarjeta',
        'dolares',
        'dolares_tasa',
        'nro_voucher',
    ];
    requiredFields.map(field => {
        if (!values[field] || values[field] < 0) {
            errors[field] = 'Requerido'
        }
    });

    if (values.valor_tarjeta && parseFloat(values.valor_tarjeta) < 0) {
        errors.valor_tarjeta = 'Debe ser un valor positivo';
    }

    if (values.dolares && parseFloat(values.dolares) < 0) {
        errors.dolares = 'Debe ser un valor positivo';
    }
    return errors;
};

export default validate;