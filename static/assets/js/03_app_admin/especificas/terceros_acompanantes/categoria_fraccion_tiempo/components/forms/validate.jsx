import {REGEX_SOLO_NUMEROS_DINERO} from "../../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'valor',
        'fraccion_tiempo'
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.valor && !REGEX_SOLO_NUMEROS_DINERO.test(values.valor)) {
        errors.valor = 'Solo valores monetarios';
    } else if (values.valor && values.valor < 0) {
        errors.valor = 'Solo valores positivos';
    }
    return errors;
};

export default validate;