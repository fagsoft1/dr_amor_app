import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableSee from '../../../../00_utilities/components/ui/icon/TableIconButtonDetail';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/TableIconButtonEdit';
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome/index';

import ReactTable from "react-table";

const areEqual = (prevProps, nextProps) => {
    return prevProps.list === nextProps.list;
};

const Tabla = memo((props) => {
    const data = _.map(props.list);
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
                            Header: "Nombre",
                            accessor: "nombre",
                            maxWidth: 200,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Tipo de Vehículo",
                            accessor: "tipo_vehiculo_nombre",
                            maxWidth: 250,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Hora Inicio",
                            accessor: "hora_inicio",
                            maxWidth: 80,
                            Cell: row => <div className='text-right'>{row.value}</div>
                        },
                        {
                            Header: "# Horas",
                            accessor: "numero_horas",
                            maxWidth: 60,
                            Cell: row => <div className='text-right'>{row.value}</div>
                        },
                        {
                            Header: "Lun.",
                            accessor: "lunes",
                            maxWidth: 40,
                            Cell: row => <div className='text-center'>
                                {
                                    row.value &&
                                    <FontAwesomeIcon
                                        icon={['far', 'check']}
                                        size='lg'
                                    />
                                }
                            </div>
                        },
                        {
                            Header: "Mar.",
                            accessor: "martes",
                            maxWidth: 40,
                            Cell: row => <div className='text-center'>
                                {
                                    row.value &&
                                    <FontAwesomeIcon
                                        icon={['far', 'check']}
                                        size='lg'
                                    />
                                }
                            </div>
                        },
                        {
                            Header: "Mie.",
                            accessor: "miercoles",
                            maxWidth: 40,
                            Cell: row => <div className='text-center'>
                                {
                                    row.value &&
                                    <FontAwesomeIcon
                                        icon={['far', 'check']}
                                        size='lg'
                                    />
                                }
                            </div>
                        },
                        {
                            Header: "Jue.",
                            accessor: "jueves",
                            maxWidth: 40,
                            Cell: row => <div className='text-center'>
                                {
                                    row.value &&
                                    <FontAwesomeIcon
                                        icon={['far', 'check']}
                                        size='lg'
                                    />
                                }
                            </div>
                        },
                        {
                            Header: "Vie.",
                            accessor: "viernes",
                            maxWidth: 40,
                            Cell: row => <div className='text-center'>
                                {
                                    row.value &&
                                    <FontAwesomeIcon
                                        icon={['far', 'check']}
                                        size='lg'
                                    />
                                }
                            </div>
                        },
                        {
                            Header: "Sab.",
                            accessor: "sabado",
                            maxWidth: 40,
                            Cell: row => <div className='text-center'>
                                {
                                    row.value &&
                                    <FontAwesomeIcon
                                        icon={['far', 'check']}
                                        size='lg'
                                    />
                                }
                            </div>
                        },
                        {
                            Header: "Dom.",
                            accessor: "domingo",
                            maxWidth: 40,
                            Cell: row => <div className='text-center'>
                                {
                                    row.value &&
                                    <FontAwesomeIcon
                                        icon={['far', 'check']}
                                        size='lg'
                                    />
                                }
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
                            Header: "Ver",
                            show: permisos_object.detail,
                            maxWidth: 60,
                            Cell: row =>
                                <Link
                                    to={`/app/admin/parqueadero/modalidad_fraccion_tiempo/detail/${row.original.id}`}>
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

}, areEqual);

export default Tabla;