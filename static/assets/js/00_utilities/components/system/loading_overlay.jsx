import React from 'react';
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import * as actions from "../../../01_actions/01_index";
import ErrorBoundary from './error_boundary';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {withStyles} from "@material-ui/core/styles/index";
import Typography from '@material-ui/core/Typography';


const LoadingOverlay = (props) => {
    const {esta_cargando: {cargando, mensaje}, classes, theme} = props;
    let isActive = cargando ? 'block' : 'none';
    const style = {
        display: isActive
    };
    if (!props.isAuthenticated) {
        return <Redirect to="/"/>
    }
    return (
        <div className={classes.loadingOverloadUno}>
            <div className={classes.loadingOverloadDos} style={style}>
                <div className={classes.loadingOverloadTres} style={{maxWidth: '500px', wordBreak: 'break-all'}}>
                    <FontAwesomeIcon icon={['far', 'spinner-third']} size='2x' spin/>
                    <Typography variant="h4" color="inherit" noWrap>
                        Procesando...
                    </Typography>
                    <Typography variant="overline" color="inherit" gutterBottom>
                        {mensaje}
                    </Typography>
                </div>
            </div>
            <ErrorBoundary>
                {props.children}
            </ErrorBoundary>
        </div>
    )
};

function mapPropsToState(state) {
    return {
        esta_cargando: state.esta_cargando,
        isAuthenticated: state.auth.isAuthenticated,
    }
}

const styles = theme => (
    {
        loadingOverloadUno: {
            position: 'relative'
        },
        loadingOverloadDos: {
            content: '',
            background: 'rgba(255, 255, 255, 0.5)',
            width: '100%',
            height: '7000px',
            opacity: '.9',
            position: 'absolute',
            zIndex: 1400
        },
        loadingOverloadTres: {
            borderRadius: '10px',
            position: 'fixed',
            textAlign: 'center',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1400,
            backgroundColor: theme.palette.primary.dark,
            padding: '0.5rem',
            color: 'white'
        }
    })
;

export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(LoadingOverlay));