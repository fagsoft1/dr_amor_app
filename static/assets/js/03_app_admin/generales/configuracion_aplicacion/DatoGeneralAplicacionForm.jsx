import React, {memo, Fragment} from 'react';
import {useDispatch} from 'react-redux';
import {reduxForm} from 'redux-form';
import {MyFileFieldInput, MyTextFieldSimple} from '../../../00_utilities/components/ui/forms/fields';
import validate from './validate_datos_generales_form';
import * as actions from '../../../01_actions';
import Button from '@material-ui/core/Button/index';

let Form = memo((props) => {
    const dispatch = useDispatch();
    const {
        pristine,
        submitting,
        reset,
        handleSubmit,
        initialValues,
    } = props;
    const {
        logo_medium,
        logo_small,
        icon_medium,
        icon_small,
    } = initialValues;

    const onSubmit = (v) => {
        return dispatch(actions.updateDatoGeneralAplicacion(initialValues.id, v));
    };
    const submitObject = (item) => {
        let datos_formulario = _.omit(item, 'logo');
        let datos_a_subir = new FormData();
        _.mapKeys(datos_formulario, (item, key) => {
            datos_a_subir.append(key, item);
        });
        if (item.logo) {
            if (typeof item.logo !== 'string') {
                datos_a_subir.append('logo', item.logo[0]);
            }
        }
        return datos_a_subir;
    };

    return (
        <form onSubmit={handleSubmit(v => {
            return onSubmit(submitObject(v))
        })}>
            <div className="row">
                <MyTextFieldSimple
                    className='col-12 col-md-4 col-lg-3 col-xl-2'
                    label='Nombre App'
                    name='nombre_aplicacion'
                />
                <div className='col-12'>
                    <div className="row">
                        <div className="col-12 col-sm-12 col-lg-4 text-center">
                            <div>
                                <img src={logo_medium}></img>
                            </div>
                            <div>
                                300x300
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3 text-center">
                            <div>
                                <img src={logo_small}></img>
                            </div>
                            <div>
                                256x256
                            </div>
                        </div>
                        <div className="col-12 col-sm-4 col-lg-2 text-center">
                            <div>
                                <img src={icon_medium}></img>
                            </div>
                            <div>
                                48x48
                            </div>
                        </div>
                        <div className="col-12 col-sm-2 col-lg-1 text-center">
                            <div>
                                <img src={icon_small}></img>
                            </div>
                            <div>
                                32x32
                            </div>
                        </div>
                    </div>
                </div>
                <MyFileFieldInput
                    name="logo"
                    accept="image/png, image/jpeg"
                />
                <div className="col-12">
                    <Button
                        color="primary"
                        type='submit'
                        variant="contained"
                        className='ml-3'
                        disabled={submitting || pristine}
                    >
                        Guardar
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        className='ml-3'
                        disabled={submitting || pristine}
                        onClick={reset}
                    >
                        Limpiar
                    </Button>
                </div>
            </div>
        </form>
    )
});


Form = reduxForm({
    form: "configuracionAplicacionDatoGeneralForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;