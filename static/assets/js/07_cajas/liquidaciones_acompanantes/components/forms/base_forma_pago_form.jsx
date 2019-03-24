import React, {Component, Fragment} from 'react';
import {MyTextFieldSimple, MyDropdownList} from '../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {reduxForm} from 'redux-form'
import {pesosColombianos} from "../../../../00_utilities/common";
import validate from './validate';
import Button from '@material-ui/core/Button';


class BaseFormaPagoForm extends Component {
    render() {
        const {
            handleSubmit,
            onSubmit,
            onChangeFormaPago,
            initialValues,
        } = this.props;
        const {valor_total_a_pagar, valor_a_pagar} = initialValues;
        const saldo = valor_total_a_pagar - valor_a_pagar;

        return (

            <form onSubmit={handleSubmit((v) => onSubmit({...v, saldo: saldo}))}>
                <div className="row p-1">
                    <div className='col-12'>

                        <Fragment>
                            <div className="col-12">
                                <div className="row">
                                    <MyTextFieldSimple
                                        type='number'
                                        name='valor_a_pagar'
                                        nombre='A Pagar'
                                        className='col-md-3 col-lg-2'
                                        onChange={e => {
                                            onChangeFormaPago(e.target.value)
                                        }}
                                        onDoubleClick={() => {
                                            onChangeFormaPago(valor_total_a_pagar, 0)
                                        }}
                                    />
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Total a Pagar</td>
                                            <td>{pesosColombianos(valor_total_a_pagar)}</td>
                                        </tr>
                                        <tr>

                                            <td style={{fontSize: '1rem'}}><strong>LO QUE SE PAGARÁ</strong></td>
                                            <td style={{backgroundColor: 'green', color: 'white', fontSize: '1rem'}}>
                                                {pesosColombianos(valor_a_pagar)}</td>
                                        </tr>
                                        </tbody>

                                        <tfoot>
                                        <tr>
                                            <td>Saldo</td>
                                            <td>{pesosColombianos(saldo)}</td>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </Fragment>
                        <Button
                            color="primary"
                            variant="contained"
                            className='ml-3'
                            type='submit'
                        >
                            {`Pagar ${pesosColombianos(valor_a_pagar)}`}
                        </Button>
                    </div>

                </div>
            </form>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {pago} = ownProps;
    return {
        initialValues: pago
    }
}

BaseFormaPagoForm = reduxForm({
    form: "baseFormaPagoForm",
    validate,
    enableReinitialize: true
})(BaseFormaPagoForm);

BaseFormaPagoForm = (connect(mapPropsToState, null)(BaseFormaPagoForm));

export default BaseFormaPagoForm;