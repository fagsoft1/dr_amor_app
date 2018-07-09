import React from 'react';

function renderModelo(modelo) {
    return (
        <div className={`col-4 col-sm-2 col-md-1 modelo-box est-mod-${modelo.estado}`} key={modelo.id}>
            {modelo.full_name_proxy}
        </div>
    )
}

export default (props) => {
    const {categoria} = props;
    return (
        <div className="col-12 categoria">
            <h3>{categoria.categoria}
                <span className="badge badge-pill badge-dr-amor">
                                {categoria.modelos.length}
                                </span>
            </h3>
            <div className="row">
                {categoria.modelos.map(modelo => renderModelo(modelo))}
            </div>
            <hr/>
        </div>
    )
}