import {REGEX_SOLO_NUMEROS} from "../../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'orden',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    const tamanos = {
        nombre: 20,
        orden: 2,
    };

    _.mapKeys(tamanos, (v, k) => {
        if (values[k] && values[k].length > parseInt(v)) {
            errors[k] = `No debe tener más de ${v} caracteres!`
        }
    });

    if (values.orden && !REGEX_SOLO_NUMEROS.test(values.orden)) {
        errors.orden = 'Debe de ser un número';
    }
    return errors;
};

export default validate;