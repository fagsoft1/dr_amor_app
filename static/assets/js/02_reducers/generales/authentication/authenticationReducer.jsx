const initialState = {
    token: localStorage.getItem("token"),
    punto_venta: JSON.parse(localStorage.getItem("punto_venta")),
    mi_cuenta: JSON.parse(localStorage.getItem("mi_cuenta")),
    mis_permisos: JSON.parse(localStorage.getItem("mis_permisos")),
    isAuthenticated: null,
    isLoading: true,
    user: null,
    errors: {},
};


export default function auth(state = initialState, action) {
    switch (action.type) {

        case 'USER_LOADING':
            return {...state, isLoading: true};

        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.user,
            };

        case 'LOGIN_SUCCESSFUL':
            localStorage.setItem("token", action.data.token);
            localStorage.setItem("punto_venta", action.data.punto_venta ? JSON.stringify(action.data.punto_venta) : null);
            localStorage.setItem("mi_cuenta", action.data.mi_cuenta ? JSON.stringify(action.data.mi_cuenta) : null);
            localStorage.setItem("mis_permisos", action.data.mis_permisos ? JSON.stringify(action.data.mis_permisos) : null);

            return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null};

        case 'AUTHENTICATION_ERROR':
        case 'LOGIN_FAILED':
        case 'LOGOUT_SUCCESSFUL':
            localStorage.removeItem("token");
            localStorage.removeItem("punto_venta");
            localStorage.removeItem("mi_cuenta");
            localStorage.removeItem("mis_permisos");
            return {
                ...state,
                errors: action.data,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                punto_venta: null,
                mi_cuenta: null,
                mis_permisos: null
            };

        default:
            return state;
    }
}