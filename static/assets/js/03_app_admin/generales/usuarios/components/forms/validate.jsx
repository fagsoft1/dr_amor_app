import {REGEX_CORREO_ELECTRONICO} from "../../../../../00_utilities/common";

const validate = values => {
    const errors = {};
    if (!values.username) {
        errors.username = 'Requerido';
    }
    if (!values.first_name) {
        errors.first_name = 'Requerido';
    }
    if (!values.last_name) {
        errors.last_name = 'Requerido';
    }
    if (!values.email) {
        errors.email = 'Requerido';
    } else {
        if (!REGEX_CORREO_ELECTRONICO.test(values.email)) {
            errors.email = 'Correo Electrónico Inválido';
        }
    }
    if (!values.password) {
        errors.password = 'Requerido';
    } else if (values.password !== values.password2) {
        errors.password = 'No Coinciden';
        errors.password2 = 'No Coinciden';
    }
    else {
        if (values.password.length < 8 || values.password.length > 20) {
            errors.password = `La contraseña debe tener entre 8 y 20 caracteres. Esta tiene ${values.password.length} caracteres`;
        }
    }

    const tamanos = {
        username: 30,
        first_name: 30,
        last_name: 40
    };

    _.mapKeys(tamanos, (v, k) => {
        if (values[k] && values[k].length > parseInt(v)) {
            errors[k] = `No debe tener más de ${v} caracteres!`
        }
    });
    return errors;
};

export default validate;