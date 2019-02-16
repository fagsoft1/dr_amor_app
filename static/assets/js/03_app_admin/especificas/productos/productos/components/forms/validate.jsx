import {REGEX_SOLO_NUMEROS_DINERO} from "../../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'empresa',
        'precio_venta',
        'unidad_producto',
        'categoria_dos',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const tamanos = {
        nombre: 40,
        precio_venta: 7
    };

    _.mapKeys(tamanos, (v, k) => {
        if (values[k] && values[k].length > parseInt(v)) {
            errors[k] = `No debe tener más de ${v} caracteres!`
        }
    });

    if (values.precio_venta && !REGEX_SOLO_NUMEROS_DINERO.test(values.precio_venta)) {
        errors.precio_venta = 'Debe ser un valor monetario';
    }
    return errors;
};

export default validate;