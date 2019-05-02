import React, {Component} from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import InputAdornment from '@material-ui/core/InputAdornment';
import ResumenLiquidacion from '../../cuentas/cuenta_conceptos_resumen';
import Button from "@material-ui/core/Button";
import {reduxForm, formValueSelector} from "redux-form";
import {MyTextFieldSimple} from "../../../00_utilities/components/ui/forms/fields";
import {pesosColombianos} from "../../../00_utilities/common";
import {connect} from "react-redux";

class Form extends Component {
    render() {
        const {
            cuenta,
            modal_open,
            styles,
            onCancel,
            onSubmit,
            pristine,
            submitting,
            handleSubmit,
            valor_a_pagar
        } = this.props;
        const total_a_pagar = cuenta.cxp_total - cuenta.cxc_total;
        return (
            <Dialog
                fullScreen={false}
                open={modal_open}
            >
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ResumenLiquidacion cuenta={cuenta} styles={styles}/>
                        <MyTextFieldSimple
                            className="col-6"
                            nombre='Valor a Pagar'
                            name='valor'
                            type='number'
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                        <div className="col-12 mb-2 mt-2">
                            Valor a Pagar: {pesosColombianos(valor_a_pagar)}<br/>
                            Saldo que pasa: {pesosColombianos(total_a_pagar - valor_a_pagar)}
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                type='submit'
                                disabled={submitting || pristine}
                            >
                                Liquidar
                            </Button>
                            <Button
                                color="secondary"
                                variant="contained"
                                className='ml-3'
                                onClick={() => onCancel()}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }
}

const selector = formValueSelector('modalLiquidacionForm');
Form = reduxForm({
    form: "modalLiquidacionForm",
    enableReinitialize: true
})(Form);

function mapPropsToState(state, ownProps) {
    const valor_a_pagar = selector(state, 'valor');
    return {
        valor_a_pagar: valor_a_pagar ? valor_a_pagar : 0
    }
}

Form = (connect(mapPropsToState, null)(Form));
export default Form;