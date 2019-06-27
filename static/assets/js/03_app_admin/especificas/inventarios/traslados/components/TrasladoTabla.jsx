import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableSee from '../../../../../00_utilities/components/ui/icon/TableIconButtonDetail';
import IconButtonTableEdit from '../../../../../00_utilities/components/ui/icon/TableIconButtonEdit';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";
import {fechaHoraFormatoUno} from "../../../../../00_utilities/common";

const areEqual = (prevProps, nextProps) => {
    return prevProps.list === nextProps.list;
};

const Tabla = memo(props => {
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
                            Header: "Bodega Origen",
                            accessor: "bodega_origen_nombre",
                            maxWidth: 150,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Bodega Destino",
                            accessor: "bodega_destino_nombre",
                            maxWidth: 150,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Fecha",
                            accessor: "created",
                            minWidth: 130,
                            maxWidth: 150,
                            Cell: row => fechaHoraFormatoUno(row.value)
                        },
                        {
                            Header: "Estado",
                            accessor: "estado_display",
                            minWidth: 120,
                            maxWidth: 150
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
                                !row.original.trasladado &&
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
                                !row.original.trasladado &&
                                <IconButtonTableEdit
                                    onClick={() => {
                                        onSelectItemEdit(row.original);
                                    }}/>

                        },
                        {
                            Header: "Ver",
                            show: permisos_object.detail,
                            maxWidth: 60,
                            Cell: row =>
                                <Link to={`/app/admin/inventarios/traslados/detail/${row.original.id}`}>
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