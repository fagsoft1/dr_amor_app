import React, {Fragment} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import MyDialogButtonDelete from '../../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../../../00_utilities/components/ui/icon/table_icon_button_detail';
import IconButtonTableEdit from '../../../../../00_utilities/components/ui/icon/table_icon_button_edit';
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
                                maxWidth: 200,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toLowerCase())
                                }
                            },
                            {
                                Header: "Principal",
                                accessor: "es_principal",
                                maxWidth: 80,
                                Cell: row => {
                                    return (
                                        <div className='text-center'>
                                            {
                                                row.value &&
                                                <FontAwesomeIcon
                                                    icon={['far', 'check-circle']}
                                                />
                                            }
                                        </div>
                                    )
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

                            },
                            {
                                Header: "Ver",
                                show: permisos_object.change,
                                maxWidth: 60,
                                Cell: row =>
                                    <Link
                                        to={`/app/admin/inventarios/bodegas/detail/${row.original.id}`}>
                                        <IconButtonTableSee/>
                                    </Link>

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