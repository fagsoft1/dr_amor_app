import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import EntregaBase from './wizard/formato_entrega_base';
import EntregaEfectivo from './wizard/formato_entrega_efectivo';
import DolaresTarjetas from './wizard/formato_dolares_y_tarjetas';
import Resumen from './wizard/resumen_cierre_caja';
import {withStyles} from "@material-ui/core";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogAction from '@material-ui/core/DialogActions';
import * as actions from "../../01_actions/01_index";
import Typography from "@material-ui/core/Typography";
import {pesosColombianos} from "../../00_utilities/common";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import classNames from "classnames";

const styles = theme => ({
    root: {
        width: '90%',
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    table: {
        fontSize: '0.7rem',
        td: {
            padding: '0 !important',
            margin: '0 !important',
        },
        tr: {
            padding: '0 !important',
            margin: '0 !important',
        }
    },
});

const TablaBilletesMonedas = (props) => {
    const {nombre, styles, lista, onChange, denominaciones, classes} = props;
    const sum = _.map(denominaciones, e => e.total).reduce((acu, ele) => acu + ele, 0);
    return (
        <Fragment>
            <Typography variant="h6" gutterBottom color="primary">
                {nombre}
            </Typography>
            <table className={classes.table}>
                <thead>
                <tr className={classes.table.tr}>
                    <th>Denominación</th>
                    <th># Cantidad</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                {_.map(_.orderBy(lista, e => parseFloat(e.valor), ['desc']), d => {
                    return (
                        <tr className={classes.table.tr} key={d.id}>
                            <td
                                className={classNames(classes.table.td, 'text-right')}
                            >
                                <span>{pesosColombianos(d.valor)} </span>
                                <FontAwesomeIcon
                                    icon={['far', d.tipo === 1 ? 'money-bill-wave' : 'coins']}
                                />
                            </td>
                            <td className={classes.table.td}>
                                <input
                                    value={denominaciones && denominaciones[d.id] ? denominaciones[d.id].cantidad : 0}
                                    name={d.valor} type='number'
                                    onChange={(e) => onChange(d.id, e.target.value, d.valor, d.tipo)}
                                />
                            </td>
                            <td className={classes.table.td}>
                                {denominaciones && denominaciones[d.id] ? pesosColombianos(denominaciones[d.id].total) : 0}
                            </td>
                        </tr>
                    )
                })}
                </tbody>
                <tfoot>
                <tr>
                    <td>Total {nombre.toLowerCase()}</td>
                    <td>{pesosColombianos(sum)}</td>
                </tr>
                </tfoot>
            </table>
        </Fragment>
    )
};

const GrupoTablaDinero = (props) => {
    const {billetes_monedas, onChange, denominaciones, titulo, classes} = props;
    const sum = _.map(denominaciones, e => e.total).reduce((acu, ele) => acu + ele, 0);
    return (
        <Fragment>
            <Typography variant="h6" gutterBottom color="primary">
                {titulo}
            </Typography>
            <div className="row pl-2">
                <div className="col-12 col-md-6">
                    <TablaBilletesMonedas
                        lista={_.pickBy(billetes_monedas, e => e.tipo === 1)}
                        nombre='Billetes'
                        classes={classes}
                        onChange={onChange}
                        denominaciones={_.pickBy(denominaciones, e => e.tipo === 1)}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <TablaBilletesMonedas
                        lista={_.pickBy(billetes_monedas, e => e.tipo === 2)}
                        nombre='Monedas'
                        classes={classes}
                        onChange={onChange}
                        denominaciones={_.pickBy(denominaciones, e => e.tipo === 2)}
                    />
                </div>
            </div>
            <div className='text-center'><strong>Total {titulo}: </strong> {pesosColombianos(sum)}</div>
        </Fragment>
    )
};

class CierreCajaPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            denominaciones_entrega: {},
            denominaciones_base: {},
            dolares_tasa: 0,
            dolares_cantidad: 0,
            numero_vauchers: 0,
            valor_en_tarjetas: 0

        };
        this.handleBack = this.handleBack.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.onChangeBase = this.onChangeBase.bind(this);
        this.onChangeEntrega = this.onChangeEntrega.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleChangeField = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    componentDidMount() {
        this.props.fetchBilletesMonedas()
    }

    handleNext = () => {
        const {activeStep} = this.state;
        this.setState({
            activeStep: activeStep + 1
        });
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            denominaciones_base: {},
            denominaciones_entrega: {},
            activeStep: 0,
        });
    };

    onChangeBase(id, cantidad, valor, tipo) {
        const {denominaciones_base} = this.state;
        const nueva = {cantidad, valor, total: cantidad * valor, tipo};
        this.setState({denominaciones_base: {...denominaciones_base, [id]: nueva}});
    }

    onChangeEntrega(id, cantidad, valor, tipo) {
        const {denominaciones_entrega} = this.state;
        const nueva = {cantidad, valor, total: cantidad * valor, tipo};
        this.setState({denominaciones_entrega: {...denominaciones_entrega, [id]: nueva}});
    }


    getStepContent(step) {
        const {
            denominaciones_entrega,
            denominaciones_base
        } = this.state;
        const {
            classes,
            billetes_monedas
        } = this.props;
        switch (step) {
            case 0:
                return <DolaresTarjetas
                    onSubmit={this.handleNext}
                    handleChange={this.handleChangeField}
                />;
            case 1:
                return <EntregaBase
                    getBack={this.handleBack}
                    onSubmit={this.handleNext}
                >
                    <GrupoTablaDinero
                        classes={classes}
                        titulo='Entrega de Base'
                        styles={styles}
                        onChange={this.onChangeBase}
                        denominaciones={denominaciones_base}
                        billetes_monedas={billetes_monedas}
                    />
                </EntregaBase>;
            case 2:
                return <EntregaEfectivo
                    getBack={this.handleBack}
                    onSubmit={this.handleNext}
                >
                    <GrupoTablaDinero
                        classes={classes}
                        titulo='Entrega de Efectivo'
                        styles={styles}
                        onChange={this.onChangeEntrega}
                        denominaciones={denominaciones_entrega}
                        billetes_monedas={billetes_monedas}
                    />
                </EntregaEfectivo>;
            default:
                return <div>Otro desconocido</div>;
        }
    }

    onSubmit() {
        const cierre = this.state;
        const cierre2 = {
            denominaciones_base: _.map(cierre.denominaciones_base, e => {
                return {cantidad: e.cantidad, valor: e.valor, tipo: e.tipo}
            }),
            denominaciones_entrega: _.map(cierre.denominaciones_entrega, e => {
                return {cantidad: e.cantidad, valor: e.valor, tipo: e.tipo}
            }),
            cierre_para_arqueo: {
                valor_en_tarjetas: cierre.valor_en_tarjetas,
                numero_vauchers: cierre.numero_vauchers,
                dolares_cantidad: cierre.dolares_cantidad,
                dolares_tasa: cierre.dolares_tasa
            }
        };
        console.log(cierre2)
    }

    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            onSubmit,
            onCancel,
            handleSubmit,
            modal_open,
            error,
            classes
        } = this.props;
        const steps = ['Dolares y Tarjetas', 'Entrega Efectivo', 'Entrega Base'];
        const {
            activeStep,
            denominaciones_base,
            denominaciones_entrega,
            dolares_cantidad,
            dolares_tasa,
            valor_en_tarjetas
        } = this.state;
        const suma_base = _.map(denominaciones_base, e => e.total).reduce((acu, ele) => acu + ele, 0);
        const suma_efectivo = _.map(denominaciones_entrega, e => e.total).reduce((acu, ele) => acu + ele, 0);
        return (
            <Dialog
                fullScreen={true}
                open={modal_open}
            >
                <DialogTitle id="responsive-dialog-title">
                    Cierre de Caja
                </DialogTitle>
                <DialogContent>
                    <div className={classes.root}>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const props = {};
                                const labelProps = {};
                                return (
                                    <Step key={label} {...props}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        <div>
                            {activeStep === steps.length ? (
                                <Resumen
                                    getBack={this.handleBack}
                                    onSubmit={this.onSubmit}
                                    handleReset={this.handleReset}
                                >
                                    Total Base: {pesosColombianos(suma_base)}<br/>
                                    Total Efectivo: {pesosColombianos(suma_efectivo)}<br/>
                                    Total Dolares: {pesosColombianos(dolares_cantidad * dolares_tasa)}<br/>
                                    Total Tarjetas: {pesosColombianos(dolares_cantidad * dolares_tasa)}<br/>
                                    Total Tarjetas: {pesosColombianos(valor_en_tarjetas)}<br/>
                                    Total Entrega: {pesosColombianos(suma_base + suma_efectivo)}<br/>
                                </Resumen>
                            ) : (
                                <div>
                                    {this.getStepContent(activeStep)}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
                <DialogAction>
                    <Button
                        color="secondary"
                        variant="contained"
                        className='ml-3'
                        onClick={() => onCancel()}
                    >
                        {submitting || pristine ? 'Cerrar' : 'Cancelar'}
                    </Button>
                </DialogAction>
            </Dialog>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        billetes_monedas: state.billetes_monedas
    }
}

export default withStyles(styles)(connect(mapPropsToState, actions)(CierreCajaPanel));