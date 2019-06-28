import React, {useEffect, useState, memo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import CargarDatos from "../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../00_utilities/common";
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import Typography from '@material-ui/core/Typography/index';
import {
    PRODUCTOS as permisos_productos_base,
    CATEGORIAS_PRODUCTOS as permisos_categorias_productos_base,
    CATEGORIAS_PRODUCTOS_DOS as permisos_categorias_dos_productos_base,
    UNIDADES_PRODUCTOS as permisos_unidades_productos_base
} from "../../../00_utilities/permisos/types";

import BloqueProductos from './productos/ProductoCRUD';
import BloqueCategorias from './categorias/CategoriaProductoCRUD';
import BloqueCategoriasDos from './categorias_dos/CategoriaDosProductoCRUD';
import BloqueUnidadesProductos from './unidades/UnidadesProductoCRUD';

const ListadoElementos = memo(() => {
    const [slideIndex, setSlideIndex] = useState(0);
    const productos = useSelector(state => state.productos);
    const productos_categorias = useSelector(state => state.productos_categorias);
    const productos_categorias_dos = useSelector(state => state.productos_categorias_dos);
    const productos_unidades = useSelector(state => state.productos_unidades);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const dispatch = useDispatch();
    useEffect(() => {
            dispatch(actions.fetchMisPermisosxListado([
                permisos_productos_base,
                permisos_unidades_productos_base,
                permisos_categorias_productos_base,
                permisos_categorias_dos_productos_base
            ], {callback: () => cargarDatos()}));
            return () => {
                dispatch(actions.clearCategoriasProductos());
                dispatch(actions.clearCategoriasProductosDos());
                dispatch(actions.clearUnidadesProductos());
                dispatch(actions.clearProductos());
            };
        }, []
    );

    const cargarDatos = () => {
        cargarElementos();
    };

    const cargarElementos = (value = null) => {
        let index = value !== null ? value : slideIndex;
        if (index === 0) {
            dispatch(actions.fetchProductos())
        } else if (index === 1) {
            dispatch(actions.fetchCategoriasProductos())
        } else if (index === 2) {
            dispatch(actions.fetchCategoriasProductosDos())
        } else if (index === 3) {
            dispatch(actions.fetchUnidadesProductos())
        }
    };
    const handleChange = (event, value) => {
        if (value !== slideIndex) {
            cargarElementos(value);
        }
        setSlideIndex(value);
    };

    const plural_name = 'Panel Productos';
    const singular_name = 'Panel Producto';
    const permisos_productos = permisosAdapter(mis_permisos, permisos_productos_base);
    const permisos_categorias_productos = permisosAdapter(mis_permisos, permisos_categorias_productos_base);
    const permisos_categorias_dos_productos = permisosAdapter(mis_permisos, permisos_categorias_dos_productos_base);
    const permisos_unidades_productos = permisosAdapter(mis_permisos, permisos_unidades_productos_base);
    const can_see =
        permisos_productos.list ||
        permisos_categorias_productos.list ||
        permisos_categorias_dos_productos.list ||
        permisos_unidades_productos.list;

    return (
        <ValidarPermisos can_see={can_see} nombre={plural_name}>
            <Typography variant="h5" gutterBottom color="primary">
                {singular_name}
            </Typography>
            <Tabs indicatorColor="primary"
                  textColor="primary"
                  onChange={handleChange}
                  value={slideIndex}
            >
                <Tab label="Productos" value={0}/>
                <Tab label="Categorias" value={1}/>
                <Tab label="Categorias Dos" value={2}/>
                <Tab label="Unidades" value={3}/>
            </Tabs>
            <div className="row">
                <div className="col-12">
                    {
                        slideIndex === 0 &&
                        <BloqueProductos
                            object_list={productos}
                            permisos_object={permisos_productos}
                        />
                    }
                    {
                        slideIndex === 1 &&
                        <BloqueCategorias
                            object_list={productos_categorias}
                            permisos_object={permisos_categorias_productos}
                        />
                    }
                    {
                        slideIndex === 2 &&
                        <BloqueCategoriasDos
                            object_list={productos_categorias_dos}
                            permisos_object={permisos_categorias_dos_productos}
                        />
                    }
                    {
                        slideIndex === 3 &&
                        <BloqueUnidadesProductos
                            object_list={productos_unidades}
                            permisos_object={permisos_unidades_productos}
                        />
                    }
                </div>
            </div>
            <CargarDatos
                cargarDatos={cargarDatos}
            />

        </ValidarPermisos>
    )
});

export default ListadoElementos