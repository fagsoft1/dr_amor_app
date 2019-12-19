export const SERVER_INFORMATION_TYPES = {
    fetch_server_data: 'fetch_server_information',
    clear: 'clear_server_information'
};

export const CONFIGURACION_APLICACION_TYPES = {
    fetch_configuracion_aplicacion: 'fetch_configuracion_aplicacion',
    fetch_datos_generales: 'fetch_dato_general_aplicacion',
    update_datos_generales: 'update_dato_general_aplicacion',
    clear: 'clear_configuracion_aplicacion'
};

export const HISTORICO_REVISION_TYPES = {
    fetch_all: 'fetch_historicos_revisions',
    fetch: 'fetch_historico_revision',
    clear: 'clear_historicos_revisions'
};

export const LOADING = {
    loading: 'is_loading',
    stop: 'in_not_loading',
    error: 'error_loading',
    reset: 'reset_loading',
};

export const PERMISO_TYPES = {
    fetch_all: 'fetch_permisos',
    fetch: 'fetch_permiso',
    clear: 'clear_permisos',
    update: 'update_permiso',
    mis_permisos: 'fetch_mis_permisos'
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

export const MENU_TYPES = {
    open: 'open_menu',
    close: 'close_menu',
    open_submenu: 'open_submenu',
    close_submentu: 'close_submenu',
    reset: 'reset_menu',
};