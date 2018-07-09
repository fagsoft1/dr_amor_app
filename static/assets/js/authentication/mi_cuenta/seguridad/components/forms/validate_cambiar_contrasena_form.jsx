import {REGEX_SOLO_NUMEROS} from "../../../../../00_utilities/common";
import momentLocaliser from 'react-widgets-moment';
import moment from 'moment-timezone';

moment.tz.setDefault("America/Bogota");
momentLocaliser(moment);

const validate = values => {
    const errors = {};
    const requiredFields = [
        'password_old',
        'password_2',
        'password',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.password && values.password_2 && values.password_2 !== values.password) {
        errors.password_2 = 'No coinciden';
        errors.password = 'No coinciden';
    }

    return errors;
};

export default validate;