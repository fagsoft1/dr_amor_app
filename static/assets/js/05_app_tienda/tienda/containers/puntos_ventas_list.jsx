import React, {Component} from 'react';
import * as actions from "../../../01_actions/01_index";
import {connect} from "react-redux";
import {Link} from 'react-router-dom'

const PuntoVentaItem = (props) => {
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
};

class App extends Component {
    componentDidMount() {
        this.props.fetchPuntosVentas();
    }

    componentWillUnmount() {
        this.props.clearPuntosVentas();
    }

    render() {
        const {puntos_ventas} = this.props;
        return (
            <div className="p-3">
                <div className="row">
                    {_.map(puntos_ventas, pv => <PuntoVentaItem key={pv.id} punto_venta={pv}/>)}
                </div>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        puntos_ventas: _.pickBy(state.puntos_ventas, e => e.tipo === 1)
    }
}

export default connect(mapPropsToState, actions)(App)