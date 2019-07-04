import React, {Fragment, memo, useState, useEffect} from 'react';
import {REGEX_SOLO_NUMEROS, numerosFormato} from "../../../../00_utilities/common";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome/index';

const TablaProcesoTrasladoItem = memo(props => {
    const [cantidad, setCantidad] = useState(0);
    const {item, updateCantidadTraslado, editable, traslado} = props;
    const trasladado = traslado.trasladado;
    useEffect(() => {
        const {item} = props;
        setCantidad(item.cantidad)
    }, []);
    return (
        <tr>
            <td>{item.producto_nombre}</td>
            {trasladado &&
            <td>{numerosFormato(item.cantidad_realmente_trasladada)}</td>
            }
            {!trasladado &&
            <Fragment>
                <td>{item.cantidad_origen && numerosFormato(item.cantidad_origen)}</td>
                <td>{item.cantidad_destino ? numerosFormato(item.cantidad_destino) : 0}</td>
            </Fragment>
            }
            <td>
                {editable ?
                    <input type="text" value={cantidad}
                           onBlur={() => {
                               updateCantidadTraslado({...item, cantidad});
                           }}
                           onChange={(e) => {
                               const nueva_cantidad = e.target.value;
                               if (REGEX_SOLO_NUMEROS.test(nueva_cantidad)) {
                                   setCantidad(nueva_cantidad);
                               }
                           }}/> :
                    numerosFormato(item.cantidad)
                }
            </td>
            {!trasladado &&
            <Fragment>
                <td>{item.cantidad_origen && Number(item.cantidad_origen) - Number(cantidad)}</td>
                <td>{item.cantidad_destino ? Number(item.cantidad_destino) + Number(cantidad) : Number(cantidad)}</td>
            </Fragment>}
            {editable &&
            <td>
                <FontAwesomeIcon
                    className='puntero'
                    icon={['far', 'trash']}
                    onClick={() => props.eliminarItem(item.id)}
                />
            </td>}
        </tr>
    )
});

export default TablaProcesoTrasladoItem;