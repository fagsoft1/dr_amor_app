import React, {Component} from 'react';
import {MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import {reduxForm} from 'redux-form'
import validate from './validate';
import Button from '@material-ui/core/Button';


class AbrirCajaForm extends Component {
    render() {
        const {
            handleSubmit,
            submitting,
            pristine,
            reset,
        } = this.props;
        return (
            <form onSubmit={handleSubmit((v) => console.log(v))}>
                <div className="row p-1">
                    <MyTextFieldSimple
                        type='number'
                        name='valor'
                        nombre='Valor'
                        className='col-12 col-md-4'
                    />
                </div>
                <Button
                    color="primary"
                    variant="contained"
                    className='ml-3'
                    type='submit'
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

            </form>
        )
    }
}

AbrirCajaForm = reduxForm({
    form: "abrirCajaForm",
    validate,
    enableReinitialize: true
})(AbrirCajaForm);

export default AbrirCajaForm;