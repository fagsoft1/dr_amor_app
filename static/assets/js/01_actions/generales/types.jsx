export const FETCH_MIS_PERMISOS = 'fetch_mis_permisos';
export const FETCH_OTRO_USUARIO_PERMISOS = 'fetch_otro_usuario_permisos';

////cargando
export const LOADING = 'is_loading';
export const LOADING_STOP = 'in_not_loading';

export const PERMISO_TYPES = {
    fetch_all: 'fetch_permisos',
    fetch: 'fetch_permiso',
    clear: 'clear_permisos',
    update: 'update_permiso',
};

export const GRUPO_PERMISO_TYPES = {
    create: 'create_grupo_permiso',
    delete: 'delete_grupo_permiso',
    fetch_all: 'fetch_grupos_permisos',
    fetch: 'fetch_grupo_permiso',
    clear: 'clear_grupos_permisos',
    update: 'update_grupo_permiso',
};

export const USUARIO_TYPES = {
    create: 'create_usuario',
    delete: 'delete_usuario',
    fetch_all: 'fetch_usuarios',
    fetch: 'fetch_usuario',
    clear: 'clear_usuarios',
    update: 'update_usuario',
    cuenta: 'fetch_mi_cuenta'
};

export const BILLETE_MONEDA_TYPES = {
    create: 'create_billete_moneda',
    delete: 'delete_billete_moneda',
    fetch_all: 'fetch_billetes_monedas',
    fetch: 'fetch_billete_moneda',
    clear: 'clear_billetes_monedas',
    update: 'update_billete_moneda',
};