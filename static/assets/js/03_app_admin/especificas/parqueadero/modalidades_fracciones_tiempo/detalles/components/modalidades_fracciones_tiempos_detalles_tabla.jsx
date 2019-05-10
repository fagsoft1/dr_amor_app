import React from "react";
import MyDialogButtonDelete from '../../../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";
import {pesosColombianos} from "../../../../../../00_utilities/common";

class Tabla extends React.Component {
    render() {

        const data = _.orderBy(this.props.data, ['minutos'], ['asc']);
        const {
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
                                Header: "Minutos",
                                accessor: "minutos",
                                maxWidth: 100,
                                Cell: row => <div className='text-right'>{row.value} Minutos</div>
                            },
                            {
                                Header: "Horas",
                                accessor: "minutos",
                                maxWidth: 100,
                                Cell: row => <div className='text-right'>{row.value / 60} Horas</div>
                            },
                            {
                                Header: "Valor",
                                accessor: "valor",
                                maxWidth: 100,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            }
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

                            }
                        ]
                    }
                ]}
                defaultPageSize={20}
                className="-striped -highlight tabla-maestra"
            />
        );
    }
}

export default Tabla;