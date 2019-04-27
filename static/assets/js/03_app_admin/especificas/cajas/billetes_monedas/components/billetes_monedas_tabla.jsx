import React from "react";
import MyDialogButtonDelete from '../../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../../../00_utilities/components/ui/icon/table_icon_button_edit';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import ReactTable from "react-table";
import {pesosColombianos} from "../../../../../00_utilities/common";

class Tabla extends React.Component {
    render() {

        const data = _.orderBy(this.props.data, ['tipo', 'valor'], ['asc', 'desc']);
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
                                        element_name={row.original.valor}
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