import React from "react";
import {numerosFormato, pesosColombianos} from '../../../../../00_utilities/common'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {
        const {data, verMovimientoProducto} = this.props;
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
                                maxWidth: 200,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Costo Unitario",
                                accessor: "costo_unitario",
                                maxWidth: 150,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                            {
                                Header: "Cantidad",
                                accessor: "saldo_cantidad",
                                maxWidth: 100,
                                Cell: row => <div className='text-right'>{numerosFormato(row.value)}</div>
                            },
                            {
                                Header: "Costo",
                                accessor: "saldo_costo",
                                maxWidth: 150,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            }
                        ]
                    },
                    {
                        Header: "Opciones",
                        columns: [
                            {
                                Header: "Movim.",
                                maxWidth: 60,
                                Cell: row =>
                                    <FontAwesomeIcon
                                        icon={['far', 'eye']}
                                        onClick={() => verMovimientoProducto(row.original.producto)}
                                    />
                            },
                        ]
                    }
                ]}
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        );
    }
}

export default Tabla;