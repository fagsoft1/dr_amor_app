const validate = values => {
    const errors = {};

    const requiredFields = [
        'descripcion',
        'tipo',
        'grupo',
        'tipo_cuenta',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    const tamanos = {
        descripcion: 60
    };

    _.mapKeys(tamanos, (v, k) => {
        if (values[k] && values[k].length > parseInt(v)) {
            errors[k] = `No debe tener más de ${v} caracteres!`
        }
    });
    return errors;
};

export default validate;