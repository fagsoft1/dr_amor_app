import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableEdit from '../../../../../00_utilities/components/ui/icon/TableIconButtonEdit';

import ReactTable from "react-table";
import {fechaFormatoUno} from "../../../../../00_utilities/common";


const areEqual = (prevProps, nextProps) => {
    return prevProps.list === nextProps.list;
};
const Tabla = memo((props) => {
    let data = _.map(props.list);
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
                            Header: "Empresa",
                            accessor: "empresa_nombre",
                            maxWidth: 200,
                            filterable: true
                        },
                        {
                            Header: "Nro. Autorización",
                            accessor: "numero_autorizacion",
                            maxWidth: 100,
                            Cell: row => <div className='text-center'>{row.value}</div>
                        },
                        {
                            Header: "F. Autorización",
                            accessor: "fecha_autorizacion",
                            maxWidth: 120,
                            Cell: row => <div className='text-right'>{row.value ? fechaFormatoUno(row.value) : ''}</div>
                        },
                        {
                            Header: "# Inf.",
                            accessor: "rango_inferior_numeracion",
                            maxWidth: 50,
                            Cell: row => <div className='text-center'>{row.value}</div>
                        },
                        {
                            Header: "# Act.",
                            accessor: "consecutivo_actual",
                            maxWidth: 50,
                            Cell: row => <div className='text-center'>{row.value}</div>
                        },
                        {
                            Header: "# Sup.",
                            accessor: "rango_superior_numeracion",
                            maxWidth: 50,
                            Cell: row => <div className='text-center'>{row.value}</div>
                        },
                        {
                            Header: "F. Ini Vig",
                            accessor: "fecha_inicial_vigencia",
                            maxWidth: 120,
                            Cell: row => <div className='text-right'>{row.value ? fechaFormatoUno(row.value) : ''}</div>
                        },
                        {
                            Header: "F. Fin Vig",
                            accessor: "fecha_final_vigencia",
                            maxWidth: 120,
                            Cell: row => <div className='text-right'>{row.value ? fechaFormatoUno(row.value) : ''}</div>
                        },
                    ]
                },
                {
                    Header: "Lugar Emisión",
                    columns: [
                        {
                            Header: "País",
                            accessor: "pais_emision",
                            maxWidth: 120
                        },
                        {
                            Header: "Ciudad",
                            accessor: "ciudad_emision",
                            maxWidth: 120
                        },
                        {
                            Header: "Dirección",
                            accessor: "direccion_emision",
                            maxWidth: 120
                        },
                        {
                            Header: "Teléfono",
                            accessor: "telefono_emision",
                            maxWidth: 120
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