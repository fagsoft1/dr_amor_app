import React, {memo} from 'react';
import {useDispatch} from 'react-redux';
import {reduxForm} from 'redux-form';
import {MyFileFieldInput} from '../../../00_utilities/components/ui/forms/fields';
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
        configuracion_aplicacion,
    } = props;
    if (configuracion_aplicacion.length === 0) {
        return <div></div>
    }
    const {datos_generales} = configuracion_aplicacion;

    const onSubmit = (v) => {
        if (datos_generales.id) {
            return dispatch(actions.updateDatoGeneralAplicacion(datos_generales.id, v))
        }
    };
    const submitObject = (item) => {
        let datos_formulario = _.omit(item, 'logo');
        let datos_a_subir = new FormData();
        _.mapKeys(datos_formulario, (item, key) => {
            datos_a_subir.append(key, item);
        });
        if (item.logo) {
            if (typeof item.firma !== 'string') {
                datos_a_subir.append('logo', item.logo[0]);
            }
        }
        return datos_a_subir;
    };

    return (
        <form onSubmit={handleSubmit(v => {
            return onSubmit(submitObject(v))
        })}>
            {datos_generales &&
            datos_generales.logo &&
            <div className="row">
                <div className="col-12 col-sm-12 col-lg-4 text-center">
                    <div>
                        <img src={datos_generales.logo_medium}></img>
                    </div>
                    <div>
                        300x300
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3 text-center">
                    <div>
                        <img src={datos_generales.logo_small}></img>
                    </div>
                    <div>
                        256x256
                    </div>
                </div>
                <div className="col-12 col-sm-4 col-lg-2 text-center">
                    <div>
                        <img src={datos_generales.icon_medium}></img>
                    </div>
                    <div>
                        48x48
                    </div>
                </div>
                <div className="col-12 col-sm-2 col-lg-1 text-center">
                    <div>
                        <img src={datos_generales.icon_small}></img>
                    </div>
                    <div>
                        32x32
                    </div>
                </div>
            </div>
            }
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
        </form>
    )
});


Form = reduxForm({
    form: "configuracionAplicacionDatoGeneralForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;