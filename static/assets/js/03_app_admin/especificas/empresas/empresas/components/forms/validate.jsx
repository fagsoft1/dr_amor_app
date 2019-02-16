const validate = values => {
    const errors = {};
    const requiredFields = [
        'nombre',
        'nit',
    ];

    const tamanos = {
        nombre: 40,
        nit: 20
    };

    _.mapKeys(tamanos, (v, k) => {
        if (values[k] && values[k].length > parseInt(v)) {
            errors[k] = `No debe tener más de ${v} caracteres!`
        }
    });

    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;