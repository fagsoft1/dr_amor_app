import React, {memo, useEffect} from 'react';
import * as actions from "../../../01_actions";
import {useDispatch, useSelector} from "react-redux";
import {Link} from 'react-router-dom'

const PuntoVentaItem = memo(props => {
    const {punto_venta} = props;
    return (
        <div className='p-1 col-6 col-md-4 col-lg-3 col-xl-2 puntero'>
            <Link to={`/app/tienda/punto_venta/${punto_venta.id}`}>
                <div className='p-1 text-center' style={{border: '1px solid black', borderRadius: '5px'}}>
                    {punto_venta.nombre}
                </div>
            </Link>
        </div>
    )
});

const App = memo(props => {
    const dispatch = useDispatch();
    const puntos_ventas = useSelector(state => _.pickBy(state.puntos_ventas, e => e.tipo === 1));
    useEffect(() => {
        dispatch(actions.fetchPuntosVentas());
        return () => {
            dispatch(actions.clearPuntosVentas());
        }
    });

    return (
        <div className="p-3">
            <div className="row">
                {_.map(puntos_ventas, pv => <PuntoVentaItem key={pv.id} punto_venta={pv}/>)}
            </div>
        </div>
    )

});

export default App;