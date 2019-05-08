const validate = values => {
    const errors = {};

    const requiredFields = [
        'tipo_vehiculo',
        'modalidad_fraccion_tiempo',
        'placa',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;