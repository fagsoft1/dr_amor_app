import React, {Fragment, memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {GROUPS} from "../../../permisos";
import CreateForm from './forms/GrupoPermisoCRUDForm';
import Tabla from './GrupoPermisoCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOCCrud';
import Checkbox from '@material-ui/core/Checkbox/index';
import FormControlLabel from '@material-ui/core/FormControlLabel/index';
import Typography from '@material-ui/core/Typography/index';
import ListaBusqueda from '../../../00_utilities/utiles';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(() => {
    const dispatch = useDispatch();
    const [id_grupo_actual, setIdGrupoActual] = useState(null);
    const cargarDatos = () => {
        const cargarPermisosActivos = () => dispatch(actions.fetchPermisosActivos({
            callback: () => setIdGrupoActual(null)
        }));
        return dispatch(actions.fetchGruposPermisos({callback: cargarPermisosActivos}));
    };


    const actualizarPermiso = (permiso) => {
        const callback = () => {
            dispatch(actions.fetchGrupoPermiso(id_grupo_actual));
            dispatch(actions.notificarAction(`Se ha actualizado con éxito el grupo de permisos con el permiso ${permiso.codename}`));
        };
        if (id_grupo_actual) {
            dispatch(actions.addPermisoGrupo(id_grupo_actual, permiso.id, {callback}));
        }
    };

    const buscarBusqueda = (lista, busqueda) => {
        return _.pickBy(lista, permiso => {
            return (
                permiso.codename.toString().toLowerCase().includes(busqueda.toString().toLowerCase()) ||
                (permiso.nombre ? permiso.nombre.toString().toLowerCase().includes(busqueda.toString().toLowerCase()) : true)
            )
        });
    };

    const onSelectItemDetail = (item) => {
        dispatch(actions.fetchGrupoPermiso(item.id, {callback: () => setIdGrupoActual(item.id)}));
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearGruposPermisos());
            dispatch(actions.clearPermisos());
        };
    }, []);
    const object_list = useSelector(state => state.grupos_permisos);
    let permisos = useSelector(state => state.permisos);
    const permisos_object = useTengoPermisos(GROUPS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchGrupoPermiso(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteGrupoPermiso(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createGrupoPermiso(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateGrupoPermiso(id, item, options)),
    };

    const grupo_seleccionado = id_grupo_actual ? object_list[id_grupo_actual] : null;
    if (grupo_seleccionado) {
        permisos = _.mapKeys(_.map(permisos, p => (
            {...p, en_grupo: grupo_seleccionado.permissions.includes(p.id)}
        )), 'id');
    }

    return (
        <Fragment>
            <CRUD
                onSelectItemDetail={onSelectItemDetail}
                cargarDatos={cargarDatos}
                method_pool={method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name='Grupos Permisos'
                singular_name='Grupo Permiso'
            />
            {
                grupo_seleccionado &&
                <div className="row pl-5">
                    <div className="col-12">
                        <Typography variant="h6" gutterBottom color="primary">
                            Permisos de: {grupo_seleccionado.to_string}
                        </Typography>
                    </div>
                    <ListaBusqueda>
                        {
                            busqueda => {
                                const permisos_lista = buscarBusqueda(permisos, busqueda);
                                return (
                                    _.map(permisos_lista, p => {
                                        return (
                                            <div key={p.id} className='col-12 col-md-6 col-lg-4 col-xl-3'>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            key={p.id}
                                                            checked={p.en_grupo}
                                                            onChange={() => actualizarPermiso(p)}
                                                            color='primary'
                                                        />
                                                    }
                                                    label={p.to_string}
                                                />
                                            </div>
                                        )
                                    })
                                )
                            }
                        }
                    </ListaBusqueda>
                </div>
            }
        </Fragment>
    )

});

export default List;