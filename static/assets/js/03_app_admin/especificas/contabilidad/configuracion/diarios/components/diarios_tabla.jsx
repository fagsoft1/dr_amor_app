import React from "react";
import Checkbox from '@material-ui/core/Checkbox/index';
import MyDialogButtonDelete from '../../../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableSee from '../../../../../../00_utilities/components/ui/icon/TableIconButtonDetail';
import IconButtonTableEdit from '../../../../../../00_utilities/components/ui/icon/TableIconButtonEdit';
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome/index';

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {
        let data = this.props.data
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
                                Header: "Nombre",
                                accessor: "nombre",
                                maxWidth: 150,
                                filterable: true
                            },
                            {
                                Header: "Código",
                                accessor: "codigo",
                                maxWidth: 80
                            },
                            {
                                Header: "Tipo",
                                accessor: "tipo_nombre",
                                maxWidth: 150,
                                filterable: true
                            }
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
    }
}

export default Tabla;