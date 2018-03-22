import {REGEX_CORREO_ELECTRONICO} from "../../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'username',
        'first_name',
        'last_name',
        'email',
        'password',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.email && !REGEX_CORREO_ELECTRONICO.test(values.email)) {
        errors.email = 'Correo Electrónico Inválido';
    }

    if (values.password) {
        if (values.password !== values.password2) {
            errors.password = 'No Coinciden';
            errors.password2 = 'No Coinciden';
        }
        else {
            if (values.password.length < 8 || values.password.length > 20) {
                errors.password = `La contraseña debe tener entre 8 y 20 caracteres. Esta tiene ${values.password.length} caracteres`;
            }
        }
    }
    return errors;
};

export default validate;