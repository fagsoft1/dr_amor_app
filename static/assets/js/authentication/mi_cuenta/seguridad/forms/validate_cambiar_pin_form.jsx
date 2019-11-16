import {REGEX_SOLO_NUMEROS} from "../../../../00_utilities/common";
import momentLocaliser from 'react-widgets-moment';
import moment from 'moment-timezone';

moment.tz.setDefault("America/Bogota");
momentLocaliser(moment);

const validate = values => {
    const errors = {};
    const requiredFields = [
        'confirmar_pin',
        'pin',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.confirmar_pin && values.pin && values.confirmar_pin !== values.pin) {
        errors.pin = 'No coinciden';
        errors.confirmar_pin = 'No coinciden';
    }

    if (values.pin && !REGEX_SOLO_NUMEROS.test(values.pin)) {
        errors.pin = 'Debe ser sólo números';
    }

    if (values.pin && values.pin.length !== 4) {
        errors.pin = 'Debe de tener sólo 4 dígitos';
    }

    return errors;
};

export default validate;