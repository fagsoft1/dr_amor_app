const validate = values => {
    const errors = {};

    const requiredFields = [
        'codigo_comprobante',
        'descripcion',
        'titulo_comprobante',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const tamanos = {
        codigo_comprobante: 4
    };

    _.mapKeys(tamanos, (v, k) => {
        if (values[k] && values[k].length > parseInt(v)) {
            errors[k] = `No debe tener más de ${v} caracteres!`
        }
    });

    return errors;
};

export default validate;