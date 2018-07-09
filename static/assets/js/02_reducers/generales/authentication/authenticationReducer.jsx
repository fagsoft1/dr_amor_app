const initialState = {
    token: localStorage.getItem("token"),
    punto_venta: localStorage.getItem("punto_venta"),
    mi_cuenta: localStorage.getItem("mi_cuenta"),
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
            return {...state, isAuthenticated: true, isLoading: false, user: action.user};

        case 'LOGIN_SUCCESSFUL':
            localStorage.setItem("token", action.data.token);
            localStorage.setItem("punto_venta", action.data.punto_venta ? JSON.stringify(action.data.punto_venta) : null);
            localStorage.setItem("mi_cuenta", action.data.mi_cuenta ? JSON.stringify(action.data.mi_cuenta) : null);
            return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null};

        case 'AUTHENTICATION_ERROR':
        case 'LOGIN_FAILED':
        case 'LOGOUT_SUCCESSFUL':
            localStorage.removeItem("token");
            localStorage.removeItem("punto_venta");
            localStorage.removeItem("mi_cuenta");
            return {
                ...state, errors: action.data, token: null, user: null,
                isAuthenticated: false, isLoading: false, punto_venta: null, mi_cuenta: null
            };

        default:
            return state;
    }
}