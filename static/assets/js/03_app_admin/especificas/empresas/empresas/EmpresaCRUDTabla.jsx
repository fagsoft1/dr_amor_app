import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/TableIconButtonEdit';
import IconButtonTableHistory from '../../../../00_utilities/components/ui/icon/TableIconButtonHistory';


import Table from "react-table";
import selectTableHOC from "react-table/lib/hoc/selectTable";

const SelectTable = selectTableHOC(Table);

const areEqual = (prevProps, nextProps) => {
    return prevProps.list === nextProps.list && prevProps.selection === nextProps.selection;
};
const Tabla = memo((props) => {
    const data = _.map(props.list);
    const {
        selection,
        getTrGroupProps,
        isSelected,
        toggleAll,
        checkboxTable,
        selectAll,
        toggleSelection,
        rowFn,
        updateItem,
        onHistoricoItem,
        singular_name,
        onDelete,
        onSelectItemEdit,
        permisos_object
    } = props;
    return (
        <SelectTable
            ref={r => checkboxTable.current = r}
            getTrGroupProps={getTrGroupProps}
            selection={selection}
            selectType="checkbox"
            isSelected={isSelected}
            selectAll={selectAll}
            toggleSelection={toggleSelection}
            toggleAll={toggleAll}
            keyField="id"
            previousText='Anterior'
            nextText='Siguiente'
            pageText='Página'
            ofText='de'
            rowsText='filas'
            getTrProps={rowFn}
            data={data}
            noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
            columns={[
                {
                    Header: "Caracteristicas",
                    columns: [
                        {
                            Header: "Nombre",
                            accessor: "nombre",
                            maxWidth: 350,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Nit",
                            accessor: "nit",
                            maxWidth: 150,
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
                        {
                            Header: "Historico",
                            maxWidth: 60,
                            Cell: row =>
                                <IconButtonTableHistory
                                    onClick={() => {
                                        onHistoricoItem(row.original);
                                    }}/>

                        },
                    ]
                }
            ]}
            defaultPageSize={10}
            className="-striped -highlight tabla-maestra"
        />
    )
}, areEqual);

export default Tabla;