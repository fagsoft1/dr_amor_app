const validate = values => {
    const errors = {};

    const requiredFields = [
        'empresa',
        'consecutivo_actual',
        'rango_inferior_numeracion',
        'rango_superior_numeracion',
        'fecha_inicial_vigencia',
        'fecha_final_vigencia',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    return errors;
};

export default validate;