import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/TableIconButtonEdit';

import ReactTable from "react-table";
import {pesosColombianos} from "../../../../00_utilities/common";

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
                            Header: "Fracción Tiempo",
                            accessor: "fraccion_tiempo_nombre",
                            maxWidth: 250
                        },
                        {
                            Header: "Valor",
                            accessor: "valor",
                            maxWidth: 150,
                            Cell: row => pesosColombianos(row.value)
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
                                    element_name={row.original.fraccion_tiempo_nombre}
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