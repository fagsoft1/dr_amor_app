import React, {Component, Fragment} from 'react';

import BaseFormaPagoCamposForm from './base_forma_pago_form';
import Typography from '@material-ui/core/Typography';


class FormaPago extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valor_efectivo: 0,
            valor_tarjeta: 0,
        };
        this.onChangeFormaPago = this.onChangeFormaPago.bind(this);
    }

    onChangeFormaPago(valor_tarjeta, valor_efectivo) {
        this.setState({valor_tarjeta, valor_efectivo})
    }

    render() {
        const {
            onSubmit,
            texto_boton,
            valor_a_pagar = 0,
            perdir_observacion_devolucion = false,
        } = this.props;

        const {valor_efectivo, valor_tarjeta} = this.state;

        return (
            <div className="row">
                <div className="col-12">
                    <Typography variant="h5" gutterBottom color="primary">
                        Forma de Pago
                    </Typography>
                    {this.props.children}
                    <BaseFormaPagoCamposForm
                        texto_boton={texto_boton}
                        onSubmit={onSubmit}
                        perdir_observacion_devolucion={perdir_observacion_devolucion}
                        onChangeFormaPago={this.onChangeFormaPago}
                        es_devolucion={valor_a_pagar < 0}
                        pago={{
                            valor_a_pagar,
                            valor_efectivo,
                            valor_tarjeta
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default FormaPago;