import React, {memo} from "react";
import {numerosFormato, pesosColombianos} from '../../../../00_utilities/common'
import IconButtonTableSee from '../../../../00_utilities/components/ui/icon/TableIconButtonDetail';

import ReactTable from "react-table";

const areEqual = (prevProps, nextProps) => {
    return prevProps.list === nextProps.list;
};

const Tabla = memo((props) => {
    const {verMovimientoProducto, bodega} = props;
    const data = _.map(_.pickBy(props.list, e => {
        return (e.es_ultimo_saldo && e.bodega === bodega.id)
    }));
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
                                <IconButtonTableSee
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
}, areEqual);
export default Tabla;