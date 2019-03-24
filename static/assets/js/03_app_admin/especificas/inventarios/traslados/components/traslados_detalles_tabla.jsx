import React, {Fragment} from 'react';
import TablaProcesoTrasladoItem from './traslados_detalles_tabla_item';

const TablaProcesoTraslado = (props) => {
    const trasladado = props.traslado.trasladado;
    const {editable} = props;
    return (
        <table className='table table-responsive table-striped' style={{fontSize: '0.8rem'}}>
            <thead>
            <tr>
                <th>Producto</th>
                {trasladado && <th>Cantidad Trasladada</th>}
                {
                    !trasladado &&
                    <Fragment>
                        <th>Cant. Ant. Origen</th>
                        <th>Cant. Ant. Destino</th>
                    </Fragment>
                }
                <th>Cant. Solicitada</th>
                {
                    !trasladado &&
                    <Fragment>
                        <th>Cant. Fin Origen</th>
                        <th>Cant. Fin Destino</th>
                    </Fragment>
                }
                {
                    editable &&
                    <th>Eliminar</th>
                }
            </tr>
            </thead>
            <tbody>
            {_.map(props.traslados, e =>
                <TablaProcesoTrasladoItem
                    editable={editable}
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