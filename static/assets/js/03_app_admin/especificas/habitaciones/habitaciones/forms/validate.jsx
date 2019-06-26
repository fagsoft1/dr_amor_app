import {REGEX_SOLO_NUMEROS} from "../../../../../00_utilities/common";

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

    const tamanos = {
        numero: 4
    };

    _.mapKeys(tamanos, (v, k) => {
        if (values[k] && values[k].length > parseInt(v)) {
            errors[k] = `No debe tener más de ${v} caracteres!`
        }
    });

    if (values.numero && !REGEX_SOLO_NUMEROS.test(values.numero)) {
        errors.numero = 'Debe ser un número entero';
    }
    return errors;
};

export default validate;