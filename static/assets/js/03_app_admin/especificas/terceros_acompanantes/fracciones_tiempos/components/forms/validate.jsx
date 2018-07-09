import {REGEX_SOLO_NUMEROS} from "../../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'minutos',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.minutos && !REGEX_SOLO_NUMEROS.test(values.minutos)) {
        errors.minutos = 'Debe de ser un número';
    }

    if (values.minutos <= 0) {
        errors.minutos = 'Debe de ser un número positivo';
    }
    return errors;
};

export default validate;