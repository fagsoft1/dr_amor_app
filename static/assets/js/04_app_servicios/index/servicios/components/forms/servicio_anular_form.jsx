import React, {Component, Fragment} from 'react';
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import {reduxForm} from 'redux-form'
import {FlatIconModal} from '../../../../../00_utilities/components/ui/icon/iconos_base';
import validate from './validate_anular';
import {formValueSelector} from 'redux-form';
import {connect} from "react-redux";
import {pesosColombianos} from "../../../../../00_utilities/common";
import Typography from '@material-ui/core/Typography';


class ServicioAnularForm extends Component {
    render() {
        const {
            handleSubmit,
            onSubmit,
            servicio,
            valores
        } = this.props;
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
                            nombre='Especifique claramente por qué va a anular...'
                            multiline
                            rowsMax="4"
                            className='col-md-12'
                        />
                        {
                            valores.observacion_anulacion &&
                            <Fragment>
                                <FlatIconModal
                                    text='Solicitar Anulación'
                                    className='btn btn-primary col-md-4'
                                    //disabled={submitting || pristine}
                                    type='submit'
                                />
                                <div className='col-12'>
                                    <strong>Valor a devolver: </strong> {pesosColombianos(servicio.valor_total)}
                                </div>
                            </Fragment>
                        }
                    </div>

                </div>
            </form>
        )
    }
}

const selector = formValueSelector('ServicioAnularForm');
ServicioAnularForm = reduxForm({
    form: "ServicioAnularForm",
    validate,
    enableReinitialize: true
})(ServicioAnularForm);

function mapPropsToState(state, ownProps) {
    return {
        valores: selector(state, 'observacion_anulacion', '')
    }
}

ServicioAnularForm = (connect(mapPropsToState, null)(ServicioAnularForm));

export default ServicioAnularForm;