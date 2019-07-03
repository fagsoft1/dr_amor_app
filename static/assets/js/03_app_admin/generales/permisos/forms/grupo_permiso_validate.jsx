const validate = values => {
    const errors = {};
    if (!values.name) {
        errors.name = 'Requerido';
    }
    const tamanos = {
        name: 20
    };

    _.mapKeys(tamanos, (v, k) => {
        if (values[k] && values[k].length > parseInt(v)) {
            errors[k] = `No debe tener más de ${v} caracteres!`
        }
    });
    return errors;
};

export default validate;