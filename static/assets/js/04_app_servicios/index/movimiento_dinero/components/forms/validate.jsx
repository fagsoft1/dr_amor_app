import {REGEX_SOLO_NUMEROS_DINERO} from "../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'franquicia',
        'nro_autorizacion',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const requiredFieldsNumeros = [
        'valor_tarjeta',
        'valor_efectivo',
    ];
    requiredFieldsNumeros.map(field => {
        if (!values[field] < 0) {
            errors[field] = 'Requerido'
        }
    });


    if (values.valor_tarjeta && !REGEX_SOLO_NUMEROS_DINERO.test(values.valor_tarjeta)) {
        errors.valor_tarjeta = 'Sólo valores monetarios'
    }

    if (values.valor_efectivo && !REGEX_SOLO_NUMEROS_DINERO.test(values.valor_efectivo)) {
        errors.valor_efectivo = 'Sólo valores monetarios'
    }

    if (values.valor_tarjeta < 0) {
        errors.valor_tarjeta = 'No puede ser un valor negativo'
    }

    if (values.valor_efectivo < 0) {
        errors.valor_efectivo = 'No puede ser un valor negativo'
    }

    return errors;
};

export default validate;