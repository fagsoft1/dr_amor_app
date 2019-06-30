import React, {useState, useEffect} from 'react';
import {useDispatch} from "react-redux";
import * as actions from "../../01_actions/01_index";

const tengoPermiso = (mis_permisos, permisos) => {
    const mis_permisos_array = _.map(mis_permisos);
    const validaciones_array = [permisos].map(permiso => {
        return mis_permisos_array.includes(permiso)
    });
    return !validaciones_array.includes(false);
};


const permisosAdapter = (mis_permisos, permisos_view) => {
    return _.mapValues(permisos_view, p => tengoPermiso(mis_permisos, p));
};

const useTengoPermisos = (permisos) => {
    const dispatch = useDispatch();
    const [tengo_permisos, setTengoPermisos] = useState(permisosAdapter([], permisos));
    const handlePermisos = (response) => {
        setTengoPermisos(permisosAdapter(_.map(response, p => p.codename), permisos))
    };
    useEffect(() => {
        dispatch(actions.fetchMisPermisosxListado([permisos], {callback: handlePermisos}));
    }, []);
    return tengo_permisos;
};

export default useTengoPermisos;