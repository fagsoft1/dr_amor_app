import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableSee from '../../../../00_utilities/components/ui/icon/TableIconButtonDetail';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/TableIconButtonEdit';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

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
                            Header: "Id",
                            accessor: "id",
                            maxWidth: 80
                        },
                        {
                            Header: "Nombre",
                            accessor: "nombre",
                            maxWidth: 150
                        },
                        {
                            Header: "Orden",
                            accessor: "orden",
                            maxWidth: 50
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
                            show: permisos_object.detail,
                            maxWidth: 60,
                            Cell: row =>
                                <Link to={`/app/admin/usuarios/acompanantes/detail/${row.original.id}`}>
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