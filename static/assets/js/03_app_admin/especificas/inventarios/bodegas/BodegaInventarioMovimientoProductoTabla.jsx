import React, {memo} from "react";
import {numerosFormato, fechaFormatoUno, pesosColombianos} from '../../../../00_utilities/common'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome/index';

import ReactTable from "react-table";

const areEqual = (prevProps, nextProps) => {
    return prevProps.list === nextProps.list;
};
const Tabla = memo(props => {
        const data = _.map(_.orderBy(props.list, ['modified'], ['desc']), e => e);
        return (
            <ReactTable
                data={data}
                noDataText={`No hay inventario para mostrar`}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Nombre",
                                accessor: "producto_nombre",
                                maxWidth: 200
                            },
                            {
                                Header: "Fecha",
                                accessor: "movimiento_fecha",
                                maxWidth: 150,
                                Cell: row => fechaFormatoUno(row.value)
                            },
                            {
                                Header: "Detalle",
                                accessor: "movimiento_detalle",
                                maxWidth: 200
                            },
                            {
                                Header: "Proveedor",
                                accessor: "movimiento_proveedor_nombre",
                                maxWidth: 200
                            },
                            {
                                Header: "Costo Uni.",
                                accessor: "costo_unitario",
                                maxWidth: 80,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                            {
                                Header: "Ultimo",
                                accessor: "es_ultimo_saldo",
                                maxWidth: 150,
                                Cell: row => {
                                    return (
                                        <div className='text-center'>{
                                            row.value &&
                                            <FontAwesomeIcon
                                                icon={['far', 'check-circle']}
                                            />
                                        }</div>
                                    )
                                }
                            }
                        ]
                    },
                    {
                        Header: "Entra",
                        columns: [
                            {
                                Header: "Cantidad",
                                accessor: "entra_cantidad",
                                maxWidth: 80,
                                Cell: row => <div className='text-right'>{numerosFormato(row.value)}</div>
                            },
                            {
                                Header: "Costo",
                                accessor: "entra_costo",
                                maxWidth: 80,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                        ]
                    },
                    {
                        Header: "Sale",
                        columns: [
                            {
                                Header: "Cantidad",
                                accessor: "sale_cantidad",
                                maxWidth: 80,
                                Cell: row => <div className='text-right'>{numerosFormato(row.value)}</div>
                            },
                            {
                                Header: "Costo",
                                accessor: "sale_costo",
                                maxWidth: 80,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                        ]
                    },
                    {
                        Header: "Saldo",
                        columns: [
                            {
                                Header: "Cantidad",
                                accessor: "saldo_cantidad",
                                maxWidth: 80,
                                Cell: row => <div className='text-right'>{numerosFormato(row.value)}</div>
                            },
                            {
                                Header: "Costo",
                                accessor: "saldo_costo",
                                maxWidth: 80,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                        ]
                    },
                ]}
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        );
    }, areEqual
);

export default Tabla;