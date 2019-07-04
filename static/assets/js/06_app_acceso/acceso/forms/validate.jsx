import {REGEX_CORREO_ELECTRONICO} from "../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'pin',
        'id_tercero',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.pin && values.pin.length !== 4) {
        errors.pin = `El pin es de ${values.pin.length} digitos y debe ser de 4`;
    }
    return errors;
};

export default validate;