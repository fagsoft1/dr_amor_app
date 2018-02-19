import axios from "axios/index";

const asyncValidateFunction = (values, dispatch, props, blurredField, URL) => {
    const {initialValues, asyncBlurFields} = props;
    return new Promise((resolve, reject) => {
        let parametros = ``;
        asyncBlurFields.map(
            campo => {
                if (initialValues) {
                    if (initialValues[campo] !== values[campo]) {
                        if (values[campo]) {
                            parametros += `&${campo}=${values[campo]}`
                        }
                    }
                } else {
                    if (values[campo]) {
                        parametros += `&${campo}=${values[campo]}`
                    }
                }
            }
        );
        const FULL_URL = `${URL}?${parametros}&format=json`;
        axios.get(FULL_URL)
            .then((request) => {
                resolve(request.data);
            })
            .catch(errors => {
                reject(errors);
            })

    });
};
export default asyncValidateFunction;