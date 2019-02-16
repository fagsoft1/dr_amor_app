import React, {Component, Fragment} from 'react';
import {Field, reduxForm, getFormValues} from 'redux-form';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {connect} from "react-redux";
import {pesosColombianos} from "../../../../00_utilities/common";
import validate from './validate';
import Button from '@material-ui/core/Button';


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
                                    <FontAwesomeIcon icon={['far', d.tipo === 0 ? 'money-bill-wave' : 'coins']}/>
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
                <Button
                    color="primary"
                    variant="contained"
                    className='ml-3'
                    onClick={v => console.log(v)}
                >
                    Cerrar Caja
                </Button>
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