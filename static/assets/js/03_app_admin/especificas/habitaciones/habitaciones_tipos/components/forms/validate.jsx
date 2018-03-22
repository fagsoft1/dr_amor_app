import {REGEX_SOLO_NUMEROS_DINERO} from "../../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'valor',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.valor && !REGEX_SOLO_NUMEROS_DINERO.test(values.valor)) {
        errors.valor = 'Debe ser un valor en dinero';
    }
    return errors;
};

export default validate;