import momentLocaliser from 'react-widgets-moment';
import moment from 'moment-timezone';

moment.tz.setDefault("America/Bogota");
momentLocaliser(moment);

const validate = values => {
    const errors = {};
    const requiredFields = [
        'nombre_1',
        'apellido_1',
        'grupo_sanguineo',
        'tipo_documento',
        'nro_identificacion_1',
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

    const tamanos = {
        nombre_1: 60,
        nombre_segundo_1: 30,
        codigo: 3,
        alias_modelo: 30,
        apellido_1: 20,
        apellido_segundo_1: 20,
        nro_identificacion_1: 30,
    };

    _.mapKeys(tamanos, (v, k) => {
        if (values[k] && values[k].length > parseInt(v)) {
            errors[k] = `No debe tener más de ${v} caracteres!`
        }
    });

    if (values.fecha_nacimiento) {
        const now = moment();
        const fechaHoy = moment(now, "YYYY MM DD", "es");
        const fecha_nacimiento = moment(values.fecha_nacimiento, "YYYY MM DD", "es").tz('America/Bogota');
        const diferencia = fechaHoy.diff(fecha_nacimiento, "years");
        if (diferencia < 18) {
            errors.fecha_nacimiento = 'Debe ser mayor a 18 años'
        }
    }

    return errors;
};

export default validate;