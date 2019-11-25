import React, {Component, Fragment} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox
} from '../../../../../../../00_utilities/components/ui/forms/fields';
import TextField from '@material-ui/core/TextField';
import {MyFormTagModal} from '../../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import {pesosColombianos, fechaFormatoUno} from "../../../../../../../00_utilities/common";
import NumberFormat from 'react-number-format';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Select from "react-select";

const styles = {
    table: {
        fontSize: '0.8rem',
        height: '300px',
        td: {
            padding: '0',
            margin: '0',
            paddingLeft: '3px',
            paddingRight: '3px',
            border: '1px solid black'
        },
        td_right: {
            padding: '0',
            margin: '0',
            paddingRight: '3px',
            paddingLeft: '3px',
            textAlign: 'right',
            border: '1px solid black'
        },
        td_total: {
            padding: '0',
            margin: '0',
            paddingRight: '3px',
            paddingLeft: '3px',
            textAlign: 'right',
            borderBottom: 'double 3px'
        },
        tr: {
            padding: '0',
            margin: '0',
        }
    },
};

function NumberFormatCustom(props) {
    const {inputRef, onChange, ...other} = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator="."
            decimalSeparator=","
            prefix="$"
        />
    );
}


class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apuntes_contables_asiento: {},
            apuntes_contables_asiento_original: {}
        };
        this.addNuevaLinea = this.addNuevaLinea.bind(this);
        this.updateLinea = this.updateLinea.bind(this);
    }

    componentWillMount() {
        this.addNuevaLinea()
    }

    componentDidMount() {
        const {item_seleccionado, asientos_contables, terceros} = this.props;
        if (item_seleccionado) {
            let apuntes_contables_actuales = asientos_contables[item_seleccionado.id].apuntes_contables;
            apuntes_contables_actuales = apuntes_contables_actuales.map(a => ({
                id: a.id,
                cuenta_contable: {
                    value: a.cuenta_contable,
                    label: `${a.cuenta_contable} - ${a.cuenta_nombre}`
                },
                debito: parseFloat(a.debito),
                credito: parseFloat(a.credito),
                accion: 'LOADED'
            }));
            apuntes_contables_actuales = _.mapKeys(apuntes_contables_actuales, 'id');
            this.setState({
                apuntes_contables_asiento: apuntes_contables_actuales,
                apuntes_contables_asiento_original: apuntes_contables_actuales
            })
        }
    }

    addNuevaLinea() {
        const {apuntes_contables_asiento} = this.state;
        const nuevo_id = _.size(apuntes_contables_asiento);
        const nueva_linea = {
            id: `nu-${nuevo_id}`,
            cuenta_contable: null,
            debito: 0,
            credito: 0,
            accion: 'CREATE'
        };
        this.setState({
                apuntes_contables_asiento: {
                    ...apuntes_contables_asiento, [nueva_linea.id]: nueva_linea
                }
            }
        )
    }

    deleteLinea(id_linea) {
        const {apuntes_contables_asiento} = this.state;
        const linea = apuntes_contables_asiento[id_linea];
        if (linea.accion === 'CREATE') {
            this.setState({apuntes_contables_asiento: _.omit(apuntes_contables_asiento, id_linea)})
        } else {
            this.setState({
                    apuntes_contables_asiento: {
                        ...apuntes_contables_asiento,
                        [id_linea]: {...linea, accion: 'DELETE'}
                    }
                }
            )
        }
    }

    updateLinea(id, campo, valor) {
        const {
            apuntes_contables_asiento,
            apuntes_contables_asiento_original
        } = this.state;
        let linea = apuntes_contables_asiento[id];
        linea = {...linea, [campo]: valor};

        if (linea.accion !== 'CREATE') {
            let linea_original = apuntes_contables_asiento_original[id];
            const es_linea_cargada = linea_original['accion'] === 'LOADED';
            if (es_linea_cargada) {
                if (
                    linea['cuenta_contable'] === linea_original['cuenta_contable'] &&
                    parseFloat(linea['debito']) === parseFloat(linea_original['debito']) &&
                    parseFloat(linea['credito']) === parseFloat(linea_original['credito'])
                ) {
                    linea = {...linea, ['accion']: 'LOADED'}
                } else {
                    linea = {...linea, ['accion']: 'EDITED'}
                }
            }
        }
        this.setState({
            apuntes_contables_asiento: {
                ...apuntes_contables_asiento,
                [id]: linea
            }
        })
    }

    onSubmit(v) {
        const {
            onSubmit,
            diario,
            fecha,
            empresa,
            item_seleccionado,
        } = this.props;
        let {apuntes_contables_asiento} = this.state;
        apuntes_contables_asiento = _.pickBy(apuntes_contables_asiento, ap => ap.cuenta_contable !== null);
        let elementos = {
            ...this.state,
            tercero: v.tercero,
            apuntes_contables_asiento: JSON.stringify(_.map(apuntes_contables_asiento, e => ({
                ...e,
                cuenta_contable: e.cuenta_contable.value
            }))),
            diario_contable: diario.id,
            fecha,
            empresa: empresa.id,
            concepto: v.concepto
        };
        if (item_seleccionado) {
            elementos = {...elementos, id: item_seleccionado.id}
        }
        return onSubmit(elementos);
    }

    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            onCancel,
            handleSubmit,
            modal_open,
            singular_name,
            cuentas_contables,
            error,
            diario,
            fecha,
            empresa,
            terceros
        } = this.props;
        let {
            apuntes_contables_asiento,
            concepto
        } = this.state;
        apuntes_contables_asiento = _.pickBy(apuntes_contables_asiento, a => a.accion !== 'DELETE');
        const add = _.size(_.pickBy(apuntes_contables_asiento, cu => cu.cuenta_contable === null)) === 0;
        const total_debito = _.map(apuntes_contables_asiento).reduce((v, s) => parseFloat(v) + parseFloat(s.debito), 0);
        const total_credito = _.map(apuntes_contables_asiento).reduce((v, s) => parseFloat(v) + parseFloat(s.credito), 0);
        const diferencia = Math.abs(total_credito - total_debito);

        const tiene_apuntes_contables = _.size(_.pickBy(apuntes_contables_asiento, cu => cu.cuenta_contable !== null)) > 0;
        const tiene_cambios_en_apuntes = _.size(_.pickBy(apuntes_contables_asiento, cu => cu.accion !== 'LOADED')) > 0;

        const puede_guardar = diferencia === 0 && tiene_apuntes_contables && total_debito > 0;

        return (
            <MyFormTagModal
                fullScreen={true}
                onCancel={onCancel}
                onSubmit={handleSubmit(v => this.onSubmit(v))}
                reset={() => {
                    this.setState(s => ({
                        apuntes_contables_asiento: s.apuntes_contables_asiento_original
                    }));
                    reset();
                }}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine && !tiene_cambios_en_apuntes && puede_guardar}
                element_type={singular_name}
                error={error}
            >
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="row">
                        <div className="col-12">
                            Empresa: {empresa.nombre}
                        </div>
                        <div className="col-12">
                            Fecha: {fechaFormatoUno(fecha)}
                        </div>
                        <div className="col-12">
                            Diario: {diario.nombre}
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-8">
                    <div className="row">
                        <div className="col-12">
                            <MyCombobox
                                className="col-12 col-md-6"
                                label='Tercero'
                                label_space_xs={4}
                                name='tercero'
                                valuesField='id'
                                textField='full_name_proxy'
                                data={_.map(terceros, e => e)}
                                placeholder='Seleccione Tercero...'
                                filter={'contains'}
                            />
                        </div>
                        <MyTextFieldSimple
                            className="col-12"
                            label='Concepto'
                            name='concepto'
                            case='U'
                            value={concepto}
                            onChange={(e) => {
                                this.setState({concepto: e.target.value});
                            }}
                        />
                    </div>
                </div>
                <div className="col-12">
                    Apuntes Contables <span onClick={() => this.addNuevaLinea()}>Adicionar</span>
                </div>
                <div className="col-12">
                    <table className='table table-responsive table-striped'
                           style={{...styles.table, width: '1200px'}}>
                        <thead>
                        <tr style={styles.table.tr}>
                            <th style={styles.table.td}>Cuenta</th>
                            <th style={styles.table.td}>Débito</th>
                            <th style={styles.table.td}>Crédito</th>
                            <th style={styles.table.td}>{diferencia !== 0 ? 'Diferencia' : ''}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            _.map(apuntes_contables_asiento, a =>
                                <tr key={a.id} style={styles.table.tr}>
                                    <td style={{...styles.table.td, width: '500px'}}>
                                        <Select
                                            autoFocus
                                            value={a.cuenta_contable}
                                            onChange={e => this.updateLinea(a.id, 'cuenta_contable', e)}
                                            options={
                                                _.map(cuentas_contables, e => {
                                                    return {value: e.id, label: `${e.codigo} - ${e.descripcion}`}
                                                })
                                            }
                                            valueKey='id'
                                            labelKey='label'
                                            placeholder='Seleccione Cuenta'
                                            simpleValue
                                        />
                                    </td>
                                    <td style={styles.table.td}>
                                        {
                                            a.cuenta_contable &&
                                            cuentas_contables[a.cuenta_contable.value] &&
                                            <Fragment>
                                                <FontAwesomeIcon
                                                    icon={['far', `${cuentas_contables[a.cuenta_contable.value].naturaleza === 'D' ? 'chevron-circle-up' : 'chevron-circle-down'}`]}
                                                    style={{
                                                        color: `${cuentas_contables[a.cuenta_contable.value].naturaleza === 'D' ? 'green' : 'red'}`
                                                    }}
                                                />
                                                <TextField
                                                    value={a.debito}
                                                    inputProps={{
                                                        style: {textAlign: "right"}
                                                    }}

                                                    onChange={
                                                        e => this.updateLinea(
                                                            a.id,
                                                            'debito',
                                                            parseFloat(e.target.value ? e.target.value : 0)
                                                        )
                                                    }
                                                    InputProps={{
                                                        inputComponent: NumberFormatCustom,
                                                    }}
                                                />
                                            </Fragment>
                                        }
                                    </td>
                                    <td style={styles.table.td}>
                                        {
                                            a.cuenta_contable &&
                                            cuentas_contables[a.cuenta_contable.value] &&
                                            <Fragment>
                                                <FontAwesomeIcon
                                                    icon={['far', `${cuentas_contables[a.cuenta_contable.value].naturaleza === 'C' ? 'chevron-circle-up' : 'chevron-circle-down'}`]}
                                                    style={{
                                                        color: `${cuentas_contables[a.cuenta_contable.value].naturaleza === 'C' ? 'green' : 'red'}`
                                                    }}
                                                />
                                                <TextField
                                                    inputProps={{
                                                        style: {textAlign: "right"}
                                                    }}
                                                    value={a.credito}
                                                    onChange={
                                                        e => this.updateLinea(
                                                            a.id,
                                                            'credito',
                                                            parseFloat(e.target.value ? e.target.value : 0)
                                                        )
                                                    }
                                                    InputProps={{
                                                        inputComponent: NumberFormatCustom,
                                                    }}
                                                    onBlur={(e) => {
                                                        if (add) {
                                                            this.addNuevaLinea()
                                                        }
                                                    }}
                                                />
                                            </Fragment>
                                        }
                                    </td>
                                    <td style={{...styles.table.td, padding: '3px'}}
                                        className='text-center'>
                                        <FontAwesomeIcon
                                            icon={['far', 'minus-circle']}
                                            size={'lg'}
                                            style={{
                                                color: 'red'
                                            }}
                                            className='puntero'
                                            onClick={() => this.deleteLinea(a.id)}
                                        />
                                    </td>
                                </tr>)
                        }
                        </tbody>
                        {
                            _.size(apuntes_contables_asiento) > 0 &&
                            <tfoot>
                            <tr>
                                <td style={styles.table.td}>Total</td>
                                <td style={styles.table.td_right}>{pesosColombianos(total_debito)}</td>
                                <td style={styles.table.td_right}>{pesosColombianos(total_credito)}</td>
                                <td style={styles.table.td_right}></td>
                            </tr>
                            {
                                diferencia !== 0 &&
                                <tr>
                                    <td style={styles.table.td}>Diferencia</td>
                                    <td style={styles.table.td_right}></td>
                                    <td style={styles.table.td_right}></td>
                                    <td style={styles.table.td_right}>{pesosColombianos(Math.abs(diferencia))}</td>
                                </tr>
                            }
                            </tfoot>

                        }
                    </table>
                </div>
            </MyFormTagModal>
        )
    }
}

Form = reduxForm({
    form: "habitacionesForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;