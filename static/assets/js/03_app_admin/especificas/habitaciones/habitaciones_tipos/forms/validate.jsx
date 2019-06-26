import {REGEX_SOLO_NUMEROS_DINERO} from "../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'valor',
        'porcentaje_impuesto',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const tamanos = {
        nombre: 30,
        valor: 7,
        porcentaje_impuesto: 5
    };

    _.mapKeys(tamanos, (v, k) => {
        if (values[k] && values[k].length > parseInt(v)) {
            errors[k] = `No debe tener más de ${v} caracteres!`
        }
    });

    if (values.valor && !REGEX_SOLO_NUMEROS_DINERO.test(values.valor)) {
        errors.valor = 'Debe ser un valor en dinero';
    }
    return errors;
};

export default validate;