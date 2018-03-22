const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'codigo',
        'categoria',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.codigo && values.codigo.length!==3) {
        errors.codigo = 'Debe tener 3 letras el código de la categoría';
    }
    return errors;
};

export default validate;