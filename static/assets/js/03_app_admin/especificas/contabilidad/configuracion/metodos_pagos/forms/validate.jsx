const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'tipo',
        'diario_contable',
        'cuenta_bancaria',
        'cuenta_metodo_pago',
        'cuenta_metodo_pago_devolucion',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;