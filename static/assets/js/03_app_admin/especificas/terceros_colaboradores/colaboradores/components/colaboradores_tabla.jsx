import React from "react";
import MyDialogButtonDelete from '../../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableSee from '../../../../../00_utilities/components/ui/icon/TableIconButtonDetail';
import IconButtonTableEdit from '../../../../../00_utilities/components/ui/icon/TableIconButtonEdit';
import {Link} from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';

import ReactTable from "react-table";

const styles = {
    avatar: {
        margin: 10,
    },
    bigAvatar: {
        margin: 10,
        width: 60,
        height: 60,
    },
};


class Tabla extends React.Component {
    render() {
        const data = _.map(this.props.list);
        const {
            updateItem,
            singular_name,
            uploadFotoPerfil,
            onDelete,
            onSelectItemEdit,
            permisos_object,
            classes
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
                                accessor: "full_name",
                                maxWidth: 250,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Identificación",
                                accessor: "identificacion",
                                maxWidth: 200,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Grup. Sang.",
                                accessor: "grupo_sanguineo",
                                maxWidth: 100,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].toString().includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Username",
                                accessor: "usuario_username",
                                maxWidth: 100,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].toString().includes(filter.value.toUpperCase())
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
                                        element_name={row.original.full_name_proxy}
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
                                show: permisos_object.view,
                                maxWidth: 60,
                                Cell: row =>
                                    <Link to={`/app/admin/terceros/colaboradores/detail/${row.original.id}`}>
                                        <IconButtonTableSee/>
                                    </Link>

                            },
                            {
                                Header: "Prueba",
                                maxWidth: 150,
                                Cell: row =>
                                    <input
                                        type="file"
                                        onChange={(e) => uploadFotoPerfil(row.original.id, e.target.files[0])}
                                        accept=".jpg, .jpeg, .png"
                                    />
                            },
                            {
                                Header: "Prueba2",
                                maxWidth: 150,
                                accessor: 'imagen_perfil_url',
                                Cell: row =>
                                    <Grid container justify="center" alignItems="center">
                                        <Avatar alt="Remy Sharp" src={row.value} className={classes.bigAvatar}/>
                                    </Grid>
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

export default withStyles(styles)(Tabla);