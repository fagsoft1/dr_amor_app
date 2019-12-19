import React, {useContext, useState, useEffect} from 'react';

import StylesContext from '../../../../../00_utilities/contexts/StylesContext';
import Combobox from "react-widgets/lib/Combobox";
import Button from "@material-ui/core/Button";
import {useSelector} from "react-redux/es/hooks/useSelector";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../../01_actions";
import PropTypes from "prop-types";
import MyDialogButtonDelete from "../../../../../00_utilities/components/ui/dialog/DeleteDialog";

const ImpuestoTablaRelacion = (props) => {
    const {onDelete, onAdd, impuestos_relacionados} = props;
    const dispatch = useDispatch();
    const [impuesto_seleccionado_id, setImpuestoSeleccionado] = useState(null);
    const {table} = useContext(StylesContext);
    const impuestos = useSelector(state => state.contabilidad_impuestos);
    useEffect(() => {
        dispatch(actions.fetchImpuestos());
        return () => dispatch(actions.clearImpuestos());
    }, []);
    return (
        <div className='row'>
            <Combobox
                className="col-12 col-md-9"
                data={_.map(impuestos)}
                filter='contains'
                placeholder='Buscar Impuesto'
                valueField='id'
                textField='nombre'
                onSelect={e => {
                    setImpuestoSeleccionado(e.id);
                }}
            />
            <div className="col-12 col-md-3">
                <Button
                    onClick={() => onAdd(impuesto_seleccionado_id)}
                    color='primary'
                    variant="outlined"
                >
                    Adicionar
                </Button>
            </div>
            {impuestos_relacionados.length > 0 &&
            <div className="col-12">
                <table className='table table-striped' style={table}>
                    <thead>
                    <tr style={table.tr}>
                        <th style={table.td}>Impuesto</th>
                        <th style={table.td}>Tipo Calculo</th>
                        <th style={table.td}>Cuantía Venta</th>
                        <th style={table.td}>Cuantía Compra</th>
                        <th style={table.td}></th>
                    </tr>
                    </thead>
                    <tbody>
                    {impuestos_relacionados.map(e => {
                            const tipo_impuesto = e.tipo_calculo_impuesto === 3 ? '$' : '%';
                            let tasa_importe_venta = parseFloat(e.tasa_importe_venta).toFixed(2);
                            let tasa_importe_compra = parseFloat(e.tasa_importe_compra).toFixed(2);
                            tasa_importe_venta = tipo_impuesto === '%' ? `${tasa_importe_venta}%` : `$${tasa_importe_venta}`;
                            tasa_importe_compra = tipo_impuesto === '%' ? `${tasa_importe_compra}%` : `$${tasa_importe_compra}`;
                            return (
                                <tr style={table.tr} key={e.id}>
                                    <td style={table.td}>{e.nombre}</td>
                                    <td style={table.td}>{e.tipo_calculo_impuesto_display}</td>
                                    <td style={table.td}>{tasa_importe_venta}</td>
                                    <td style={table.td}>{tasa_importe_compra}</td>
                                    <td style={table.td}>
                                        <MyDialogButtonDelete
                                            onDelete={() => {
                                                onDelete(e.id)
                                            }}
                                            element_name={e.nombre}
                                            element_type='impuesto'
                                        />
                                    </td>
                                </tr>
                            )
                        }
                    )}
                    </tbody>
                    <tfoot>
                    <tr style={table.tr}>
                    </tr>
                    </tfoot>
                </table>
            </div>}
        </div>
    )
};
ImpuestoTablaRelacion.propTypes = {
    onDelete: PropTypes.func,
    onAdd: PropTypes.func,
    impuestos_relacionados: PropTypes.array,
};

export default ImpuestoTablaRelacion;