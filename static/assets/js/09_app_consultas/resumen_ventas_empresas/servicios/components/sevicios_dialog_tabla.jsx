import React, {Component} from 'react';
import Dialog from "@material-ui/core/Dialog/index";
import DialogTitle from "@material-ui/core/DialogTitle/index";
import DialogContent from "@material-ui/core/DialogContent/index";
import DialogActions from "@material-ui/core/DialogActions/index";
import Button from "@material-ui/core/Button/index";
import {fechaHoraFormatoUno, pesosColombianos} from "../../../../00_utilities/common";
import ReactTable from "react-table";
import MyDialogButtonDelete from "../../../../00_utilities/components/ui/dialog/delete_dialog";
import IconButtonTableEdit from "../../../../00_utilities/components/ui/icon/table_icon_button_edit";

export default class ServiciosDialog extends Component {
    render() {
        const {
            is_open,
            onCerrar,
            listado_servicios
        } = this.props;
        return (
            <Dialog
                fullScreen={true}
                open={is_open}
            >
                <DialogTitle id="responsive-dialog-title">
                    Servicios
                </DialogTitle>
                <DialogContent>
                    <ReactTable
                        data={_.orderBy(listado_servicios, ['hora_inicio'], ['desc'])}
                        noDataText={`No hay servicios para mostrar`}
                        columns={[
                            {
                                Header: "Caracteristicas",
                                columns: [
                                    {
                                        Header: "Id",
                                        accessor: "id",
                                        maxWidth: 60,
                                        filterable: true,
                                        Cell: row => <div className='text-right'>{row.value}</div>
                                    },
                                    {
                                        Header: "Empresa",
                                        accessor: "empresa_nombre",
                                        maxWidth: 150,
                                        filterable: true,
                                        filterMethod: (filter, row) => {
                                            return row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                                        }
                                    },
                                    {
                                        Header: "Habitación",
                                        accessor: "habitacion_nombre",
                                        maxWidth: 150,
                                        filterable: true,
                                        filterMethod: (filter, row) => {
                                            return row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                                        }
                                    },
                                    {
                                        Header: "Acompañante",
                                        accessor: "acompanante_nombre",
                                        maxWidth: 130,
                                        filterable: true,
                                        filterMethod: (filter, row) => {
                                            return row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                                        }
                                    },
                                    {
                                        Header: "Categoria",
                                        accessor: "categoria",
                                        maxWidth: 60,
                                        filterable: true,
                                        filterMethod: (filter, row) => {
                                            return row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                                        }
                                    },
                                    {
                                        Header: "Estado",
                                        accessor: "estado_nombre",
                                        maxWidth: 110,
                                        filterable: true,
                                        filterMethod: (filter, row) => {
                                            return row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                                        }
                                    },
                                    {
                                        Header: "Hora Inicio",
                                        accessor: "hora_inicio",
                                        maxWidth: 130,
                                        Cell: row => fechaHoraFormatoUno(row.value)
                                    },
                                    {
                                        Header: "Hora Fin",
                                        accessor: "hora_final_real",
                                        maxWidth: 130,
                                        Cell: row => row.original.estado === 2 ? fechaHoraFormatoUno(row.value) : ''
                                    },
                                    {
                                        Header: "Tiempo",
                                        accessor: "tiempo_minutos",
                                        maxWidth: 40,
                                        filterable: true,
                                        Cell: row => <div className='text-right'>{row.value}</div>
                                    },
                                    {
                                        Header: "Cajero",
                                        accessor: "usuario_cajero_username",
                                        maxWidth: 90,
                                        filterable: true,
                                        filterMethod: (filter, row) => {
                                            return row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                                        }
                                    },
                                    {
                                        Header: "Valor Servicio",
                                        accessor: "valor_servicio",
                                        maxWidth: 60,
                                        Cell: row => <div className='text-right'>
                                            {pesosColombianos(row.value)}
                                        </div>
                                    },
                                    {
                                        Header: "Comisión",
                                        accessor: "comision",
                                        maxWidth: 60,
                                        Cell: row => <div className='text-right'>
                                            {pesosColombianos(row.value)}
                                        </div>
                                    }
                                ]
                            }
                        ]}
                        defaultPageSize={20}
                        className="-striped -highlight tabla-maestra"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        variant="contained"
                        className='ml-3'
                        onClick={() => onCerrar()}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}