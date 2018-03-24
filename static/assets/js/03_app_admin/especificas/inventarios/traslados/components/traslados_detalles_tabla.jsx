import React, {Fragment} from 'react';
import TablaProcesoTrasladoItem from './traslados_detalles_tabla_item';

const TablaProcesoTraslado = (props) => {
    const trasladado = props.traslado.trasladado;
    return (
        <table className='table table-responsive table-striped'>
            <thead>
            <tr>
                <th>Producto</th>
                {trasladado && <th>Cantidad Trasladada</th>}
                {
                    !trasladado &&
                    <Fragment>
                        <th>Cantidad Origen</th>
                        <th>Cantidad Destino</th>
                    </Fragment>
                }
                <th>Cantidad Solicitada</th>
                {
                    !trasladado &&
                    <Fragment>
                        <th>Cantidad Final Origen</th>
                        <th>Cantidad Final Destino</th>
                        <th>Eliminar</th>
                    </Fragment>
                }
            </tr>
            </thead>
            <tbody>
            {_.map(props.traslados, e =>
                <TablaProcesoTrasladoItem
                    traslado={props.traslado}
                    eliminarItem={props.eliminarItem}
                    updateCantidadTraslado={props.updateCantidadTraslado}
                    key={e.id} item={e}
                />
            )}
            </tbody>
        </table>
    )
};

export default TablaProcesoTraslado;