const validate = values => {
    const errors = {};
    const requiredFields = [
        'dolares_cantidad',
        'dolares_tasa',
        'valor_en_tarjetas',
        'numero_vauchers',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;