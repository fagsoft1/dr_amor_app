import React, {Fragment} from 'react';
import PropTypes from "prop-types";
import Typography from '@material-ui/core/Typography';

export const Titulo = (props) => {
    return (
        <Typography variant="h4" gutterBottom color="primary">
            {props.children}
        </Typography>
    );
};


export const AtributoTexto = (props) => {
    const {label, texto, className} = props;
    return (
        <div className={className}>
            <Typography variant="h5" gutterBottom color="primary">
                <strong>{label}:</strong> {texto}
            </Typography>
        </div>
    );
};


AtributoTexto.propTypes = {
    label: PropTypes.string,
    texto: PropTypes.string,
    className: PropTypes.string
};

export const AtributoBooleano = (props) => {
    const {label, icono_no, icono_si, className, booleano} = props;
    return (
        <div className={className}>
            <Typography variant="h5" gutterBottom color="primary">
                <strong>{label}: </strong>
                <i className={booleano ? icono_si : icono_no}
                >
                </i>
            </Typography>
        </div>
    );
};


AtributoBooleano.propTypes = {
    label: PropTypes.string,
    icono_no: PropTypes.string,
    icono_si: PropTypes.string,
    booleano: PropTypes.bool,
    className: PropTypes.string
};

export const SinObjeto = (props) => {
    return <div>Cargando...</div>
};

export const ListaAddBoton = (props) => {
    const {can_add, onClick} = props;
    return (
        <Fragment>
            {
                can_add &&
                <button
                    className="btn btn-primary"
                    style={{cursor: "pointer"}}
                    onClick={onClick}
                >
                    <i className="fas fa-plus"
                       aria-hidden="true"></i>
                </button>
            }
        </Fragment>
    )
};

ListaAddBoton.propTypes = {
    can_add: PropTypes.bool,
    onClick: PropTypes.func
};

export const TablaTdBoton = (props) => {
    const {onClick, icono, mostrar} = props;
    return (
        <Fragment>
            <td>
                {
                    mostrar &&
                    <i className={`${icono} puntero`}
                       onClick={() => {
                           onClick()
                       }}>
                    </i>
                }
            </td>
        </Fragment>
    )
};

TablaTdBoton.propTypes = {
    mostrar: PropTypes.bool,
    icono: PropTypes.string,
    onClick: PropTypes.func
};