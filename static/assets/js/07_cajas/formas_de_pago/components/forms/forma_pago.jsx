import React, {memo, useState} from 'react';

import BaseFormaPagoCamposForm from './base_forma_pago_form';
import Typography from '@material-ui/core/Typography/index';

const FormaPago = memo(props => {
    const {
        onSubmit,
        texto_boton,
        valor_a_pagar = 0,
        perdir_observacion_devolucion = false
    } = props;
    const [valor_efectivo, setEfectivo] = useState(0);
    const [valor_tarjeta, setTarjeta] = useState(0);
    const onChangeFormaPago = (valor_tarjeta, valor_efectivo) => {
        setEfectivo(valor_efectivo);
        setTarjeta(valor_tarjeta);
    };

    return (
        <div className="row">
            <div className="col-12">
                <Typography variant="h5" gutterBottom color="primary">
                    Forma de Pago
                </Typography>
                {props.children}
                <BaseFormaPagoCamposForm
                    texto_boton={texto_boton}
                    onSubmit={onSubmit}
                    perdir_observacion_devolucion={perdir_observacion_devolucion}
                    onChangeFormaPago={onChangeFormaPago}
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
});

export default FormaPago;