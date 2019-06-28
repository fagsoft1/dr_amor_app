import {REGEX_CORREO_ELECTRONICO} from "../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'bodega_destino',
        'bodega_origen',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.bodega_destino && values.bodega_origen && values.bodega_destino === values.bodega_origen) {
        errors.bodega_destino = 'Deben ser bodegas diferentes';
        errors.bodega_origen = 'Deben ser bodegas diferentes';
    }
    return errors;
};

export default validate;