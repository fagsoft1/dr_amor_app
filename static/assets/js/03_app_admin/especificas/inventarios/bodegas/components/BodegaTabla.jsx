import React, {memo} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import MyDialogButtonDelete from '../../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableSee from '../../../../../00_utilities/components/ui/icon/TableIconButtonDetail';
import IconButtonTableEdit from '../../../../../00_utilities/components/ui/icon/TableIconButtonEdit';
import {Link} from 'react-router-dom'

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
}, areEqual);

export default Tabla;