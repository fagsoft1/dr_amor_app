import React, {Fragment} from "react";
import Checkbox from '@material-ui/core/Checkbox';
import {MyDialogButtonDelete} from '../../../../../00_utilities/components/ui/dialog';
import {fechaFormatoUno} from '../../../../../00_utilities/common';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

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
                                Header: "Id",
                                accessor: "id",
                                maxWidth: 100
                            },
                            {
                                Header: "Fecha",
                                accessor: "fecha",
                                maxWidth: 150,
                                Cell: row => fechaFormatoUno(row.value)
                            },
                            {
                                Header: "Proveedor",
                                accessor: "proveedor_nombre",
                                maxWidth: 250,
                            },
                            {
                                Header: "Bodega",
                                accessor: "bodega_nombre",
                                maxWidth: 150,
                            },
                            {
                                Header: "Detalle",
                                accessor: "detalle",
                                maxWidth: 300,
                            },
                            {
                                Header: "Cargado",
                                accessor: "cargado",
                                maxWidth: 100,
                                Cell: row => {
                                    return (
                                        <div className='text-center'>
                                            {
                                                row.value &&
                                                <i className='fas fa-check-circle' style={{color: 'green'}}></i>
                                            }
                                        </div>
                                    )
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
                                    !row.original.cargado &&
                                    <MyDialogButtonDelete
                                        onDelete={() => {
                                            onDelete(row.original)
                                        }}
                                        element_name={`de ${fechaFormatoUno(row.original.fecha)} número ${row.original.id}`}
                                        element_type={singular_name}
                                    />

                            },
                            {
                                Header: "Ver",
                                show: permisos_object.detail,
                                maxWidth: 60,
                                Cell: row =>
                                    <Link
                                        to={`/app/admin/inventarios/movimientos_inventarios/detail/${row.original.id}`}>
                                        <IconButtonTableSee/>
                                    </Link>

                            }
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