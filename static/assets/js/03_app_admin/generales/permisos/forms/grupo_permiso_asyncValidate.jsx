import asyncValidateFunction from '../../../../00_utilities/components/ui/forms/asyncValidateFunction';

const URL = '/api/grupos_permisos/validar_nombre';
const asyncValidate = (values, dispatch, props, blurredField) => {
    return asyncValidateFunction(values, dispatch, props, blurredField, URL)
};
export default asyncValidate;