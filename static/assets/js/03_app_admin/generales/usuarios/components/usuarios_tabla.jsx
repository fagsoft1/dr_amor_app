import React from "react";
import Checkbox from 'material-ui/Checkbox';
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
            onSelectItem,
            handleOpen,
            can_detail,
            can_make_superuser,
            can_make_staff,
            can_make_active,
            can_delete,
            can_change
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
                                    accessor: "first_name",
                                    maxWidth: 200,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                },
                                {
                                    Header: "Apellidos",
                                    id: "last_name",
                                    accessor: "last_name",
                                    maxWidth: 200,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
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
                                    show: can_make_active,
                                    maxWidth: 60,
                                    Cell: row => (
                                        mi_cuenta.id !== row.original.id &&
                                        <Checkbox
                                            checked={row.value}
                                            onCheck={() => updateItem({...row.original, is_active: !row.value})}
                                        />
                                    )
                                },
                                {
                                    Header: "Admin",
                                    accessor: "is_superuser",
                                    show: can_make_superuser,
                                    maxWidth: 60,
                                    Cell: row => (
                                        mi_cuenta.id !== row.original.id &&
                                        <Checkbox
                                            checked={row.value}
                                            onCheck={() => updateItem({...row.original, is_superuser: !row.value})}
                                        />
                                    )
                                },
                                {
                                    Header: "Staff",
                                    accessor: "is_staff",
                                    show: can_make_staff,
                                    maxWidth: 60,
                                    Cell: row => (
                                        mi_cuenta.id !== row.original.id &&
                                        <Checkbox
                                            checked={row.value}
                                            onCheck={() => updateItem({...row.original, is_staff: !row.value})}
                                        />
                                    )
                                },
                                {
                                    Header: "Elimi.",
                                    show: can_delete,
                                    maxWidth: 60,
                                    Cell: row =>
                                        mi_cuenta.id !== row.original.id &&
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
                                    show: can_change,
                                    maxWidth: 60,
                                    Cell: row =>
                                        <IconButtonTableEdit
                                            onClick={() => {
                                                onSelectItem(row.original);
                                                handleOpen()
                                            }}/>

                                },
                                {
                                    Header: "Ver",
                                    show: can_detail,
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