import React from "react";
import Checkbox from '@material-ui/core/Checkbox';
import {MyDialogButtonDelete} from '../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
        const {
            updateItem,
            mi_cuenta,
            onDelete,
            onSelectItemEdit,
            permisos
        } = this.props;


        return (
            <div>
                <ReactTable
                    data={data}
                    columns={[
                        {
                            Header: "Personal",
                            columns: [
                                {
                                    Header: "Usuario",
                                    accessor: "username",
                                    maxWidth: 150,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toLowerCase())
                                    }
                                },
                                {
                                    Header: "Nombres",
                                    maxWidth: 300,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return (
                                            row._original.first_name.includes(filter.value.toUpperCase()) |
                                            row._original.last_name.includes(filter.value.toUpperCase())
                                        )
                                    },
                                    Cell: row => {
                                        return (
                                            `${row.original.first_name} ${row.original.last_name}`
                                        )
                                    }
                                },
                                {
                                    Header: "Correo",
                                    accessor: "email",
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
                                    Header: "Activo",
                                    accessor: "is_active",
                                    show: permisos.make_user_active,
                                    maxWidth: 60,
                                    Cell: row => (
                                        mi_cuenta.id !== row.original.id &&
                                        <Checkbox
                                            checked={row.value}
                                            onChange={() => updateItem({...row.original, is_active: !row.value})}
                                        />
                                    )
                                },
                                {
                                    Header: "Admin",
                                    accessor: "is_superuser",
                                    show: permisos.make_user_superuser,
                                    maxWidth: 60,
                                    Cell: row => (
                                        mi_cuenta.id !== row.original.id &&
                                        <Checkbox
                                            checked={row.value}
                                            onChange={() => updateItem({...row.original, is_superuser: !row.value})}
                                        />
                                    )
                                },
                                {
                                    Header: "Staff",
                                    accessor: "is_staff",
                                    show: permisos.make_user_staff,
                                    maxWidth: 60,
                                    Cell: row => (
                                        mi_cuenta.id !== row.original.id &&
                                        <Checkbox
                                            checked={row.value}
                                            onChange={() => updateItem({...row.original, is_staff: !row.value})}
                                        />
                                    )
                                },
                                {
                                    Header: "Elimi.",
                                    show: permisos.delete,
                                    maxWidth: 60,
                                    Cell: row =>
                                        mi_cuenta.id !== row.original.id &&
                                        (
                                            (mi_cuenta.is_superuser && row.original.is_superuser) ||
                                            (!row.original.is_superuser)
                                        )
                                        &&
                                        <MyDialogButtonDelete
                                            onDelete={() => {
                                                onDelete(row.original)
                                            }}
                                            element_name={row.original.username}
                                            element_type='Usuario'
                                        />

                                },
                                {
                                    Header: "Editar",
                                    show: permisos.change,
                                    maxWidth: 60,
                                    Cell: row =>
                                        <IconButtonTableEdit
                                            onClick={() => {
                                                onSelectItemEdit(row.original);
                                            }}/>

                                },
                                {
                                    Header: "Ver",
                                    show: permisos.detail,
                                    maxWidth: 60,
                                    Cell: row =>
                                        <Link to={`/app/admin/usuarios/detail/${row.original.id}`}>
                                            <IconButtonTableSee/>
                                        </Link>

                                }
                            ]
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight tabla-maestra"
                />
            </div>
        );
    }
}

export default Tabla;