import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/TableIconButtonEdit';

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
                            maxWidth: 300,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Código",
                            accessor: "codigo",
                            maxWidth: 50,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Categoría",
                            accessor: "categoria_nombre",
                            maxWidth: 200,
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

                        },
                    ]
                }
            ]}
            defaultPageSize={10}
            className="-striped -highlight tabla-maestra"
        />
    );
}, areEqual);
export default Tabla;