import {REGEX_CORREO_ELECTRONICO} from "../../../../../../00_utilities/common";

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
    return errors;
};

export default validate;