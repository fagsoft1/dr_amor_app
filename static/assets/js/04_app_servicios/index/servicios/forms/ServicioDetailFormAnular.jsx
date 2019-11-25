import React, {memo, Fragment} from 'react';
import {MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import {reduxForm} from 'redux-form'
import validate from './validate_anular';
import {formValueSelector} from 'redux-form';
import {useSelector} from "react-redux";
import {pesosColombianos} from "../../../../00_utilities/common";
import Typography from '@material-ui/core/Typography/index';
import Button from '@material-ui/core/Button/index';


const selector = formValueSelector('ServicioAnularForm');

let ServicioDetailFormAnular = memo(props => {
    const {
        handleSubmit,
        onSubmit,
        servicio
    } = props;
    const valores = useSelector(state => selector(state, 'observacion_anulacion', ''));

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row p-1">
                <div className="col-12">
                    <Typography variant="h5" gutterBottom color="primary">
                        Petición de Anulación de Servicio
                    </Typography>
                </div>
                <div className='col-12'>
                    <MyTextFieldSimple
                        name='observacion_anulacion'
                        label='Especifique claramente por qué va a anular...'
                        multiline
                        rowsMax="4"
                        className='col-md-12'
                    />
                    {
                        valores.observacion_anulacion &&
                        <Fragment>
                            <Button
                                color="primary"
                                variant="contained"
                                className='ml-3'
                                type='submit'
                            >
                                Solicitar Anulación
                            </Button>

                            <div className='col-12'>
                                <strong>Valor a devolver: </strong> {pesosColombianos(servicio.valor_total)}
                            </div>
                        </Fragment>
                    }
                </div>

            </div>
        </form>
    )

});


ServicioDetailFormAnular = reduxForm({
    form: "ServicioAnularForm",
    validate,
    enableReinitialize: true
})(ServicioDetailFormAnular);

export default ServicioDetailFormAnular;