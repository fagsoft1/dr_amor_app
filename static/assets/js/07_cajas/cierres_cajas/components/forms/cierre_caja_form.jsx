import React, {Component, Fragment} from 'react';
import {Field, FieldArray, reduxForm, formValueSelector, getFormValues} from 'redux-form';

import {MyTextFieldSimple, MyDropdownList} from '../../../../00_utilities/components/ui/forms/fields';

import BaseCierreCajaForm from './base_cierre_caja_form';
import {FlatIconModal} from '../../../../00_utilities/components/ui/icon/iconos_base';
import {connect} from "react-redux";
import {pesosColombianos} from "../../../../00_utilities/common";
import validate from './validate';


class CierreCaja extends Component {
    constructor(props) {
        super(props);
    }

    renderField({input, label, type, meta: {touched, error}}) {
        return (
            <div>
                <input {...input} type={type} placeholder={label}/>
                {touched && error && <span>{error}</span>}
            </div>
        )
    };

    renderDenominaciones = () => {
        const {
            billetes_monedas,
        } = this.props;
        // let sum_billetes_monedas = 0;
        // if (valores.denominaciones) {
        //     sum_billetes_monedas = _.map(billetes_monedas, e => e.valor).reduce(
        //         (acu, ele) => acu + parseFloat((valores.denominaciones[ele] > 0 ? valores.denominaciones[ele] : 0) * ele), 0
        //     );
        // }
        return (
            <Fragment>
                <table>
                    <tbody>
                    {_.map(billetes_monedas, d => {
                        return (
                            <tr key={d.id}>
                                <td className='text-right'>
                                    {pesosColombianos(d.valor)}
                                    <i className={`far fa-${d.tipo === 0 ? 'money-bill-wave' : 'coins'}`}>
                                    </i>
                                </td>
                                <td>
                                    <Field
                                        name={d.valor}
                                        component={this.renderField}
                                        type="number"
                                        placeholder={`# ${pesosColombianos(d.valor)}`}
                                    />
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td></td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
                <FlatIconModal
                    text='Cerrar Caja'
                    className='btn btn-primary'
                    onClick={v => console.log(v)}
                    //disabled={submitting || pristine}
                    type='submit'
                />
            </Fragment>
        )
    };

    render() {
        const {
            handleSubmit,
            onSubmit,
            valores
        } = this.props;
        const {valor_tarjeta, dolares} = valores;
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <table>
                            <tbody>
                            <tr>
                                <td className='text-right'>$ Tarjetas</td>
                                <td>
                                    <Field
                                        name='valor_tarjeta'
                                        component={this.renderField}
                                        type="number"
                                    />
                                </td>
                            </tr>
                            {valor_tarjeta > 0 &&
                            <tr>
                                <td className='text-right'># Vouchers</td>
                                <td>
                                    <Field
                                        name='nro_voucher'
                                        component={this.renderField}
                                        type="number"
                                    />
                                </td>
                            </tr>
                            }
                            <tr>
                                <td className='text-right'>$ Dolares</td>
                                <td>
                                    <Field
                                        name='dolares'
                                        component={this.renderField}
                                        type="number"
                                    />
                                </td>
                            </tr>
                            {dolares > 0 &&
                            <tr>
                                <td className='text-right'>$ Tasa</td>
                                <td>
                                    <Field
                                        name='dolares_tasa'
                                        component={this.renderField}
                                        type="number"
                                    />
                                </td>
                            </tr>
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12 col-md-6">
                        {this.renderDenominaciones()}
                    </div>
                </div>
            </form>
        )
    }
}


function mapPropsToState(state, ownProps) {
    return {
        valores: getFormValues('baseCierreCajaForm')(state) || {},
        initialValues: {
            valor_tarjeta: 0,
            dolares: 0,
        }
    }
}

CierreCaja = reduxForm({
    form: "baseCierreCajaForm",
    validate
})(CierreCaja);

CierreCaja = (connect(mapPropsToState, null)(CierreCaja));

export default CierreCaja;