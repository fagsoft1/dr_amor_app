import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/TableIconButtonEdit';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome/index';

import ReactTable from "react-table";
import {pesosColombianos} from "../../../../00_utilities/common";

const areEqual = (prevProps, nextProps) => {
    return prevProps.list === nextProps.list;
};

const Tabla = memo((props) => {
    const data = _.map(_.orderBy(props.list, ['tipo', 'valor'], ['asc', 'desc']));
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
                            Header: "Valor",
                            accessor: "valor",
                            maxWidth: 150,
                            Cell: row => <span>{pesosColombianos(row.value)}</span>
                        },
                        {
                            Header: "Tipo",
                            accessor: "tipo",
                            maxWidth: 150,
                            Cell: row => <span>{row.value === 1 ? 'Billete' : 'Moneda'}</span>
                        },
                        {
                            Header: "Activo",
                            accessor: "activo",
                            maxWidth: 150,
                            Cell: row =>
                                <div className="text-center">
                                    <FontAwesomeIcon
                                        icon={['far', `${row.value ? 'check-square' : ''}`]}
                                    />
                                </div>
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
                                    element_name={row.original.valor.toString()}
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