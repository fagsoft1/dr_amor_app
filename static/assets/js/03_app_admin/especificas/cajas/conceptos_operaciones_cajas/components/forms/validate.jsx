import {REGEX_CORREO_ELECTRONICO} from "../../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'descripcion',
        'tipo',
        'grupo',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;