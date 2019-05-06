import React from "react";
import Checkbox from '@material-ui/core/Checkbox';
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../../00_utilities/components/ui/icon/table_icon_button_detail';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/table_icon_button_edit';
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
            permisos_object,
            mi_cuenta
        } = this.props;
        return (
            <div>
                <ReactTable
                    data={data}
                    noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
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
                                    show: permisos_object.make_user_active,
                                    maxWidth: 50,
                                    Cell: row => (
                                        mi_cuenta.id !== row.original.id &&
                                        <div className='text-center' style={{width: '100%'}}>
                                            <Checkbox
                                                style={{margin: 0, padding: 0}}
                                                color='primary'
                                                checked={row.value}
                                                onChange={() => updateItem({...row.original, is_active: !row.value})}
                                            />
                                        </div>
                                    )
                                },
                                {
                                    Header: "Admin",
                                    accessor: "is_superuser",
                                    show: permisos_object.make_user_superuser,
                                    maxWidth: 50,
                                    Cell: row => (
                                        mi_cuenta.id !== row.original.id &&
                                        <div className='text-center' style={{width: '100%'}}>
                                            <Checkbox
                                                style={{margin: 0, padding: 0}}
                                                color='primary'
                                                checked={row.value}
                                                onChange={() => updateItem({...row.original, is_superuser: !row.value})}
                                            />
                                        </div>
                                    )
                                },
                                {
                                    Header: "Staff",
                                    accessor: "is_staff",
                                    show: permisos_object.make_user_staff,
                                    maxWidth: 50,
                                    Cell: row => (
                                        mi_cuenta.id !== row.original.id &&
                                        <div className='text-center' style={{width: '100%'}}>
                                            <Checkbox
                                                style={{margin: 0, padding: 0}}
                                                color='primary'
                                                checked={row.value}
                                                onChange={() => updateItem({...row.original, is_staff: !row.value})}
                                            />
                                        </div>
                                    )
                                },
                                {
                                    Header: "Elimi.",
                                    show: permisos_object.delete,
                                    maxWidth: 50,
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
                                            element_type={singular_name}
                                        />

                                },
                                {
                                    Header: "Editar",
                                    show: permisos_object.change,
                                    maxWidth: 50,
                                    Cell: row =>
                                        <IconButtonTableEdit
                                            onClick={() => {
                                                onSelectItemEdit(row.original);
                                            }}/>

                                },
                                {
                                    Header: "Ver",
                                    show: permisos_object.view,
                                    maxWidth: 50,
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