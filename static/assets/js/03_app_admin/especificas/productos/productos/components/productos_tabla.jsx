import React from "react";
import MyDialogButtonDelete from '../../../../../00_utilities/components/ui/dialog/delete_dialog';
import {pesosColombianos} from '../../../../../00_utilities/common';
import IconButtonTableEdit from '../../../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
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
                                Header: "Nombre",
                                accessor: "nombre",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Empresa",
                                accessor: "empresa_nombre",
                                maxWidth: 150,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Categoria",
                                maxWidth: 350,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return (
                                        row._original.categoria_nombre.includes(filter.value.toUpperCase()) ||
                                        row._original.categoria_dos_nombre.includes(filter.value.toUpperCase())
                                    )
                                },
                                Cell: row => {
                                    return (
                                        `${row.original.categoria_dos_nombre} - ${row.original.categoria_nombre}`
                                    )
                                }
                            },
                            {
                                Header: "Precio Venta",
                                accessor: "precio_venta",
                                maxWidth: 100,
                                Cell: row => pesosColombianos(row.value)
                            },
                            {
                                Header: "Unidad",
                                accessor: "unidad_producto_nombre",
                                maxWidth: 100,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
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
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        );
    }
}

export default Tabla;