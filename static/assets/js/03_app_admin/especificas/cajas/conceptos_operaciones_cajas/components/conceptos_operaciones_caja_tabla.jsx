import React from "react";
import MyDialogButtonDelete from '../../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object
        } = this.props;


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
                                minWidth: 300,
                                maxWidth: 500,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Tipo",
                                accessor: "tipo",
                                maxWidth: 100,
                                Cell: row => row.value === 'E' ? 'Egreso' : 'Ingreso'
                            },
                            {
                                Header: "Tipo Cuenta",
                                accessor: "tipo_cuenta",
                                maxWidth: 100
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
                                maxWidth: 100,
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
    }
}

export default Tabla;