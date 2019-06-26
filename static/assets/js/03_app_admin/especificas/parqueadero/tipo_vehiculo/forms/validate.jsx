const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'empresa',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const tamanos = {
        nombre: 120
    };

    _.mapKeys(tamanos, (v, k) => {
        if (values[k] && values[k].length > parseInt(v)) {
            errors[k] = `No debe tener más de ${v} caracteres!`
        }
    });

    if (values.valor_impuesto_unico && values.valor_impuesto_unico < 0) {
        errors.valor_impuesto_unico = 'El valor del impuesto único debe ser mayor a 0';
    }

    if (values.porcentaje_iva && values.porcentaje_iva < 0) {
        errors.porcentaje_iva = 'El % del iva debe ser mayor a 0';
    }
    return errors;
};

export default validate;