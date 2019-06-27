import asyncValidateFunction from '../../../../../00_utilities/components/ui/forms/asyncValidateFunction';

const URL = '/api/acompanantes/validar_documento_acompanante';
const asyncValidate = (values, dispatch, props, blurredField) => {
    return asyncValidateFunction(values, dispatch, props, blurredField, URL)
};
export default asyncValidate;