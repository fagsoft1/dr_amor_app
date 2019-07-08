import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../../permisos/validar_permisos";
import {permisosAdapter} from "../../../../00_utilities/common";
import Typography from '@material-ui/core/Typography/index';
import {CATEGORIAS_ACOMPANANTES as permisos_view} from "../../../../permisos";
import ListCrud from '../categoria_fraccion_tiempo/CategoriaFraccionTiempoCRUD';
import {Link} from 'react-router-dom'

const Detail = memo(props => {
    const {id} = props.match.params;
    const mis_permisos = useSelector(state => state.mis_permisos);
    const categorias_fracciones_tiempo = useSelector(state => state.categorias_fracciones_tiempos_acompanantes);
    const fracciones_tiempo = useSelector(state => state.fracciones_tiempos_acompanantes);
    const object = useSelector(state => state.categorias_acompanantes[id]);
    const permisos_object = permisosAdapter(mis_permisos, permisos_view);
    const dispatch = useDispatch();
    const cargarDatos = () => {
        const cargarCategoriasAcompanantes = () => dispatch(actions.fetchCategoriasFraccionesTiemposAcompanantes_x_categoria(id));
        return dispatch(actions.fetchCategoriaAcompanante(id, {callback: cargarCategoriasAcompanantes}));
    };

    useEffect(() => {
        dispatch(actions.fetchMisPermisosxListado([permisos_view], {callback: cargarDatos}));
        return () => {
            dispatch(actions.clearCategoriasAcompanantes());
            dispatch(actions.clearFraccionesTiemposAcompanantes());
        };
    }, []);

    if (!object) {
        return <Typography variant="overline" gutterBottom color="primary">
            Cargando...
        </Typography>
    }

    return (
        <ValidarPermisos can_see={permisos_object.detail} nombre='detalles de categoria'>
            <Typography variant="h5" gutterBottom color="primary">
                Detalle {object.nombre}
            </Typography>
            <ListCrud
                object={object}
                categorias_fracciones_tiempo_list={categorias_fracciones_tiempo}
                object_list={categorias_fracciones_tiempo}
                fracciones_tiempo_list={fracciones_tiempo}
                permisos_object={permisos_object}
            />
            <CargarDatos cargarDatos={cargarDatos}/>
            <Link to={`/app/admin/usuarios/acompanantes/dashboard`}>
                <span className='btn'>Ir a Categorías</span>
            </Link>
        </ValidarPermisos>
    )
});

export default Detail;
