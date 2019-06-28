import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableEdit from '../../../../../00_utilities/components/ui/icon/TableIconButtonEdit';


import ReactTable from "react-table";

const areEqual = (prevProps, nextProps) => {
    return prevProps.list === nextProps.list;
};
const Tabla = memo((props) => {
    let data = _.orderBy(_.map(props.list), ['cuenta_nivel'], ['asc']);
    data = _.orderBy(data, ['cuenta_nivel_8'], ['asc']);
    data = _.orderBy(data, ['cuenta_nivel_7'], ['asc']);
    data = _.orderBy(data, ['cuenta_nivel_5'], ['asc']);
    data = _.orderBy(data, ['cuenta_nivel_4'], ['asc']);
    data = _.orderBy(data, ['cuenta_nivel_3'], ['asc']);
    data = _.orderBy(data, ['cuenta_nivel_2'], ['asc']);
    data = _.orderBy(data, ['cuenta_nivel_1'], ['asc']);

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
                            Header: "Código",
                            accessor: "codigo",
                            maxWidth: 100,
                            filterable: true
                        },
                        {
                            Header: "Descripción",
                            accessor: "descripcion",
                            minWidth: 250,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Cuenta Padre",
                            accessor: "cuenta_padre_codigo",
                            maxWidth: 100,
                            filterable: true
                        },
                        {
                            Header: "Cuenta Padre Nombre",
                            accessor: "cuenta_padre_nombre",
                            maxWidth: 250,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "C1",
                            accessor: "cuenta_nivel_1",
                            maxWidth: 100,
                            filterable: true
                        },
                        {
                            Header: "C2",
                            accessor: "cuenta_nivel_2",
                            maxWidth: 100,
                            filterable: true
                        },
                        {
                            Header: "C3",
                            accessor: "cuenta_nivel_3",
                            maxWidth: 100,
                            filterable: true
                        },
                        {
                            Header: "C4",
                            accessor: "cuenta_nivel_4",
                            maxWidth: 100,
                            filterable: true
                        },
                        {
                            Header: "C5",
                            accessor: "cuenta_nivel_5",
                            maxWidth: 100,
                            filterable: true
                        },
                        {
                            Header: "C6",
                            accessor: "cuenta_nivel_6",
                            maxWidth: 100,
                            filterable: true
                        },
                        {
                            Header: "C7",
                            accessor: "cuenta_nivel_7",
                            maxWidth: 100,
                            filterable: true
                        },
                        {
                            Header: "C8",
                            accessor: "cuenta_nivel_8",
                            maxWidth: 100,
                            filterable: true
                        },
                        {
                            Header: "N",
                            accessor: "cuenta_nivel",
                            maxWidth: 100,
                            filterable: true
                        },
                        {
                            Header: "Naturaleza",
                            accessor: "naturaleza",
                            maxWidth: 50,
                            filterable: true,
                        },
                        {
                            Header: "Tipo",
                            accessor: "tipo",
                            maxWidth: 50,
                            filterable: true,
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
                    ]
                }
            ]}
            defaultPageSize={200}
            className="-striped -highlight tabla-maestra"
        />
    );
}, areEqual);
export default Tabla;