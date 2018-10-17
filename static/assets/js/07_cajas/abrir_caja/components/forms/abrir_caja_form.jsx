import React, {Component} from 'react';
import {MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import {reduxForm} from 'redux-form'
import {FlatIconModal} from '../../../../00_utilities/components/ui/icon/iconos_base';
import validate from './validate';


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
                <FlatIconModal
                    text='Guardar'
                    disabled={submitting || pristine}
                    type='submit'
                />
                <FlatIconModal
                    text="Limpiar"
                    disabled={submitting || pristine}
                    onClick={reset}
                />
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