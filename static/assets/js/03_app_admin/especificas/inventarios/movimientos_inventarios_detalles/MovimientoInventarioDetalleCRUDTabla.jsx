import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/DeleteDialog';
import {pesosColombianos, numerosFormato} from '../../../../00_utilities/common';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/TableIconButtonEdit';

import ReactTable from "react-table";

const areEqual = (prevProps, nextProps) => {
    return prevProps.list === nextProps.list;
};
const Tabla = memo((props) => {
    const data = _.map(props.list);
    const {
        updateItem,
        singular_name,
        onDelete,
        onSelectItemEdit,
        permisos_object,
        movimiento
    } = props;


    return (
        <ReactTable
            data={data}
            noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
            columns={[
                {
                    Header: "Caracteristicas",
                    columns: [
                        {
                            Header: "Producto",
                            accessor: "producto_nombre",
                            maxWidth: 200
                        },
                        {
                            Header: "$ Unitario",
                            accessor: "costo_unitario",
                            maxWidth: 80,
                            Cell: row => pesosColombianos(row.value)
                        },
                    ]
                },
                {
                    Header: "Entra",
                    columns: [
                        {
                            Header: "Cantidad",
                            accessor: "entra_cantidad",
                            maxWidth: 80,
                            Footer: (<div className='text-right'>{numerosFormato(movimiento.entra_cantidad)}</div>),
                            Cell: row => numerosFormato(row.value)
                        },
                        {
                            Header: "Costo",
                            accessor: "entra_costo",
                            maxWidth: 80,
                            Footer: (<div className='text-right'>{pesosColombianos(movimiento.entra_costo)}</div>),
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
                            Footer: (<div className='text-right'>{numerosFormato(movimiento.sale_cantidad)}</div>),
                            Cell: row => numerosFormato(row.value)
                        },
                        {
                            Header: "Costo",
                            accessor: "sale_costo",
                            maxWidth: 80,
                            Footer: (<div className='text-right'>{pesosColombianos(movimiento.sale_costo)}</div>),
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
                            Cell: row => numerosFormato(row.value)
                        },
                        {
                            Header: "Costo",
                            accessor: "saldo_costo",
                            maxWidth: 80,
                            Cell: row => pesosColombianos(row.value)
                        },
                    ]
                },
                {
                    Header: "Opciones",
                    columns: [
                        {
                            Header: "Elimi.",
                            show: permisos_object.delete,
                            maxWidth: 60,
                            Cell: row =>
                                <MyDialogButtonDelete
                                    onDelete={() => {
                                        onDelete(row.original)
                                    }}
                                    element_name={row.original.producto_nombre}
                                    element_type={singular_name}
                                />

                        },
                        {
                            Header: "Editar",
                            show: permisos_object.change,
                            maxWidth: 60,
                            Cell: row =>
                                <IconButtonTableEdit
                                    onClick={() => {
                                        onSelectItemEdit(row.original);
                                    }}/>

                        }
                    ]
                }
            ]}
            defaultPageSize={10}
            className="-striped -highlight tabla-maestra"
        />
    );
}, areEqual);

export default Tabla;