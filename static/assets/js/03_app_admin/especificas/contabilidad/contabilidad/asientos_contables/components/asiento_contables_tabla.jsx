import React from "react";
import MyDialogButtonDelete from '../../../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableEdit from '../../../../../../00_utilities/components/ui/icon/TableIconButtonEdit';

import ReactTable from "react-table";
import {fechaFormatoUno, pesosColombianos} from "../../../../../../00_utilities/common";

class Tabla extends React.Component {
    render() {
        let data = this.props.data;
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object
        } = this.props;

        return (
            <ReactTable
                data={data}
                noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Id",
                                accessor: "id",
                                maxWidth: 60,
                                filterable: true
                            },
                            {
                                Header: "Fecha",
                                accessor: "fecha",
                                minWidth: 80,
                                Cell: row => <div>
                                    {fechaFormatoUno(row.value)}
                                </div>
                            },
                            {
                                Header: "Empresa",
                                accessor: "empresa_nombre",
                                minWidth: 100,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Tercero",
                                accessor: "tercero_nombre",
                                minWidth: 120,
                                maxWidth: 220,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Concepto",
                                accessor: "concepto",
                                minWidth: 180,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Diario",
                                accessor: "diario_contable_nombre",
                                minWidth: 100,
                                maxWidth: 180,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Debitos",
                                accessor: "debitos",
                                minWidth: 70,
                                maxWidth: 100,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                            {
                                Header: "Creditos",
                                accessor: "creditos",
                                minWidth: 70,
                                maxWidth: 100,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                        ]
                    },
                    {
                        Header: "Opciones",
                        columns: [
                            // {
                            //     Header: "Activo",
                            //     accessor: "is_active",
                            //     show: permisos_object.make_user_active,
                            //     maxWidth: 60,
                            //     Cell: row => (
                            //         <Checkbox
                            //             checked={row.value}
                            //             onChange={() => updateItem({...row.original, is_active: !row.value})}
                            //         />
                            //     )
                            // },
                            {
                                Header: "Elimi.",
                                show: permisos_object.delete,
                                maxWidth: 60,
                                Cell: row => <MyDialogButtonDelete
                                    onDelete={() => {
                                        onDelete(row.original)
                                    }}
                                    element_name={row.original.to_string}
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