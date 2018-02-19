import React, {Fragment} from 'react';
import PropTypes from "prop-types";

export const Titulo = (props) => {
    return (
        <h3>
            {props.children}
        </h3>
    );
};


export const AtributoTexto = (props) => {
    const {label, texto, className} = props;
    return (
        <div className={className}>
            <h5><strong>{label}:</strong> {texto}</h5>
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
            <h5>
                <strong>{label}: </strong>
                <i className={booleano ? icono_si : icono_no}
                >
                </i>
            </h5>
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