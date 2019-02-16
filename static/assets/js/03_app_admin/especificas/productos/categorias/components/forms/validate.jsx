const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'codigo',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const tamanos = {
        nombre: 40,
        codigo: 3
    };

    _.mapKeys(tamanos, (v, k) => {
        if (values[k] && values[k].length > parseInt(v)) {
            errors[k] = `No debe tener más de ${v} caracteres!`
        }
    });

    if (values.codigo && values.codigo.length !== 3) {
        errors.codigo = 'Debe tener 3 letras el código de la categoría';
    }
    return errors;
};

export default validate;