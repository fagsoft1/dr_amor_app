import React, {Component, Fragment} from 'react';

import BaseFormaPagoCamposForm from './base_forma_pago_form';
import Typography from '@material-ui/core/Typography';


class FormaPago extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valor_a_pagar: 0
        };
        this.onChangeFormaPago = this.onChangeFormaPago.bind(this);
    }

    onChangeFormaPago(valor_a_pagar) {
        this.setState({valor_a_pagar})
    }

    render() {
        const {
            onSubmit,
            valor_total_a_pagar = 0,
        } = this.props;

        const {valor_a_pagar} = this.state;

        return (
            <div className="row">
                <div className="col-12">
                    <Typography variant="h5" gutterBottom color="primary">
                        Forma de Pago
                    </Typography>
                    {this.props.children}
                    <BaseFormaPagoCamposForm
                        onSubmit={onSubmit}
                        onChangeFormaPago={this.onChangeFormaPago}
                        pago={{
                            valor_total_a_pagar,
                            valor_a_pagar,
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default FormaPago;