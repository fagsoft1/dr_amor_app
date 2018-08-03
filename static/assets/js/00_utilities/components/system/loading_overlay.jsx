import React from 'react';
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import * as actions from "../../../01_actions/01_index";

const LoadingOverlay = (props) => {
    const {esta_cargando: {cargando, mensaje}} = props;
    let isActive = cargando ? 'block' : 'none';
    const style = {
        display: isActive
    };
    if (!props.isAuthenticated) {
        return <Redirect to="/"/>
    }
    return (
        <div className="loading-overload-uno">
            <div className="loading-overload-dos" style={style}>
                <div className="loading-overload-tres">
                    <i className="fas fa-spinner-third fa-spin">

                    </i>
                    <div style={{fontSize: '14px'}}>
                        Procesando...<br/>
                        <span style={{fontSize: '12px'}}>{mensaje}</span>
                    </div>
                </div>
            </div>
            {props.children}
        </div>
    )
};

function mapPropsToState(state, ownProps) {
    return {
        esta_cargando: state.esta_cargando,
        isAuthenticated: state.auth.isAuthenticated,
    }
}

export default connect(mapPropsToState, actions)(LoadingOverlay);