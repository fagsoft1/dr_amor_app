import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableEdit from '../../../../../00_utilities/components/ui/icon/TableIconButtonEdit';

import ReactTable from "react-table";
import {pesosColombianos} from "../../../../../00_utilities/common";

const areEqual = (prevProps, nextProps) => {
    return prevProps.list === nextProps.list;
};

const Tabla = memo((props) => {
    const data = _.orderBy(_.map(props.list), ['minutos'], ['asc']);
    const {
        singular_name,
        onDelete,
        onSelectItemEdit,
        permisos_object
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
                            Header: "Minutos",
                            accessor: "minutos",
                            maxWidth: 100,
                            minWidth: 100,
                            Cell: row => <div className='text-right'>{row.value} Minutos</div>
                        },
                        {
                            Header: "Horas",
                            accessor: "minutos",
                            maxWidth: 100,
                            minWidth: 100,
                            Cell: row => <div className='text-right'>{(row.value / 60).toFixed(2)} Horas</div>
                        },
                        {
                            Header: "$ Impuestos",
                            accessor: "impuesto",
                            maxWidth: 150,
                            Cell: row => <div className='text-right'>
                                {pesosColombianos(row.value)}
                            </div>
                        },
                        {
                            Header: "$ Ant. Impuesto",
                            maxWidth: 150,
                            accessor: "valor_antes_impuestos",
                            Cell: row => <div className='text-right'>
                                {pesosColombianos(row.value)}
                            </div>
                        },
                        {
                            Header: "$ Valor",
                            accessor: "valor",
                            maxWidth: 150,
                            Cell: row => <div className='text-right'>
                                {pesosColombianos(row.value)}
                            </div>
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
                                    element_name={row.original.nombre}
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
            defaultPageSize={20}
            className="-striped -highlight tabla-maestra"
        />
    );
}, areEqual);
export default Tabla;