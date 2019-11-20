import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/TableIconButtonEdit';

import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";

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
                            Header: "Descripción",
                            accessor: "descripcion",
                            minWidth: 250,
                            maxWidth: 250,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Tipo",
                            accessor: "tipo",
                            maxWidth: 60,
                            Cell: row => row.value === 'CREDITO' ? 'Egreso' : 'Ingreso'
                        },
                        {
                            Header: "Diario",
                            accessor: "diario_contable_nombre",
                            minWidth: 250,
                            maxWidth: 250,
                        },
                        {
                            Header: "Tipo Comprobante",
                            accessor: "tipo_comprobante_contable_empresa_descripcion",
                            minWidth: 250,
                            maxWidth: 250,
                        },
                        {
                            Header: "Indep. en Rep.",
                            accessor: "reporte_independiente",
                            maxWidth: 100,
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
                        {
                            Header: "Grupo",
                            accessor: "grupo",
                            maxWidth: 80,
                            minWidth: 80,
                            Cell: row => {
                                switch (row.value) {
                                    case 'A':
                                        return 'Acompanante';
                                    case 'P':
                                        return 'Proveedor';
                                    case 'C':
                                        return 'Colaborador';
                                    case 'T':
                                        return 'Taxis';
                                    case 'O':
                                        return 'Otro';
                                }
                            }
                        },
                    ]
                },
                {
                    Header: "Opciones",
                    columns: [
                        // {
                        //     Header: "Activo",
                        //     accessor: "is_active",
                        //     show: permisos_object.make_user_active,
                        //     maxWidth: 60,
                        //     Cell: row => (
                        //         <Checkbox
                        //             checked={row.value}
                        //             onChange={() => updateItem({...row.original, is_active: !row.value})}
                        //         />
                        //     )
                        // },
                        {
                            Header: "Elimi.",
                            show: permisos_object.delete,
                            maxWidth: 60,
                            Cell: row =>
                                <MyDialogButtonDelete
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
            defaultPageSize={10}
            className="-striped -highlight tabla-maestra"
        />
    );
}, areEqual);

export default Tabla;