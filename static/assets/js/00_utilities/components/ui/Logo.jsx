import React, {memo} from 'react';
import {useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles/index";

const useStyles = makeStyles(theme => ({
    boton: {
        borderRadius: '25px',
        border: `2px solid ${theme.palette.primary.dark}`,
        padding: '1rem',
        width: '100%',
        marginTop: '1rem',
        color: theme.palette.primary.dark,
        '&:hover': {
            border: `2px solid transparent`,
            backgroundColor: theme.palette.primary.main,
            color: 'white'
        },
        '&:active': {
            padding: '0.5rem',
            margin: '0.5rem',
            marginTop: '1.5rem',
            border: `2px solid transparent`,
            backgroundColor: theme.palette.secondary.main,
            color: 'white'
        }
    },
    bigAvatar: {
        width: 70,
        height: 70,
        border: `2px solid ${theme.palette.primary.main}`,
        '&:hover': {
            width: 80,
            height: 80,
        }
    }
}));

const Logo = memo((props) => {
    const classes = useStyles();
    const configuracion_aplicacion = useSelector(state => state.configuracion_aplicacion);
    const {datos_generales} = configuracion_aplicacion;
    return <div className='text-center'>
        <img className='img-fluid' src={datos_generales.logo_medium} alt=""/>
    </div>
});

export default Logo;