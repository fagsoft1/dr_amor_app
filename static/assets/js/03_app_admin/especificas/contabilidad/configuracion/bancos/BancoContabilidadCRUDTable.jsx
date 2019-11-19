import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableEdit from '../../../../../00_utilities/components/ui/icon/TableIconButtonEdit';

import ReactTable from "react-table";
import {Link} from "react-router-dom";
import IconButtonTableSee from "../../../../../00_utilities/components/ui/icon/TableIconButtonDetail";


const areEqual = (prevProps, nextProps) => {
    return prevProps.list === nextProps.list;
};
const Tabla = memo((props) => {
    let data = _.map(props.list);
    const {
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
                            accessor: "to_string",
                            maxWidth: 250,
                            filterable: true
                        },
                        {
                            Header: "Nit",
                            accessor: "nit",
                            maxWidth: 100,
                            filterable: true
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
                        {
                            Header: "Ver",
                            show: permisos_object.change,
                            maxWidth: 60,
                            Cell: row =>
                                <Link
                                    to={`/app/admin/contabilidad/configuracion/bancos/${row.original.id}`}>
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