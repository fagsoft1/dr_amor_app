import {REGEX_CORREO_ELECTRONICO} from "../../../../../00_utilities/common";
import momentLocaliser from 'react-widgets-moment';
import moment from 'moment-timezone';

moment.tz.setDefault("America/Bogota");
momentLocaliser(moment);

const validate = values => {
    const errors = {};
    const requiredFields = [
        'nombre',
        'apellido',
        'grupo_sanguineo',
        'tipo_documento',
        'nro_identificacion',
        'genero',
        'alias_modelo',
        'categoria_modelo',
        'fecha_nacimiento',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.fecha_nacimiento) {
        const now = moment();
        const fechaHoy = moment(now, "YYYY MM DD", "es");
        const fecha_nacimiento = moment(values.fecha_nacimiento, "YYYY MM DD", "es").tz('America/Bogota');
        const diferencia = fechaHoy.diff(fecha_nacimiento, "years");
        if(diferencia<18){
            errors.fecha_nacimiento = 'Debe ser mayor a 18 años'
        }
    }

    return errors;
};

export default validate;