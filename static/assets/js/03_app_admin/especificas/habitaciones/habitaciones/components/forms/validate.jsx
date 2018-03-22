import {REGEX_SOLO_NUMEROS} from "../../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'tipo',
        'empresa',
        'numero',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.numero && !REGEX_SOLO_NUMEROS.test(values.numero)) {
        errors.numero = 'Debe ser un número entero';
    }
    return errors;
};

export default validate;