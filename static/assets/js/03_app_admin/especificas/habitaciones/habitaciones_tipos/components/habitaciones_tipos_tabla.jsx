import React from "react";
import Checkbox from '@material-ui/core/Checkbox';
import {MyDialogButtonDelete} from '../../../../../00_utilities/components/ui/dialog';
import {pesosColombianos} from '../../../../../00_utilities/common';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

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
                                maxWidth: 150,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "% Valor sin Iva",
                                maxWidth: 150,
                                accessor: "valor_antes_impuestos",
                                Cell: row => pesosColombianos(row.value)
                            },
                            {
                                Header: "% Iva",
                                accessor: "porcentaje_impuesto",
                                maxWidth: 150,
                                Cell: row => <span>{`${row.value}%`}</span>
                            },
                            {
                                Header: "Impuesto",
                                accessor: "impuesto",
                                maxWidth: 150,
                                Cell: row => pesosColombianos(row.value)
                            },
                            {
                                Header: "Valor",
                                accessor: "valor",
                                maxWidth: 150,
                                Cell: row => pesosColombianos(row.value)
                            }
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