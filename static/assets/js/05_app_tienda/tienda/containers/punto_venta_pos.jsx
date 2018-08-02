import React, {Fragment, Component} from 'react';
import Loading from '../../../00_utilities/components/system/loading_overlay';

import Menu from './../../00_menu/index';
import ListaProductos from '../../tienda/components/lista_categorias_productos';
import Cuenta from '../../tienda/components/cuenta';
import * as actions from "../../../01_actions/01_index";
import {connect} from "react-redux";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            punto_venta: null,
            bodega: null,
        })
    }

    componentDidMount() {
        this.props.fetchPuntosVentas();
        // this.props.fetchPuntosVentas(() => {
        //     const puntos_ventas = _.map(this.props.puntos_ventas, e => e);
        //     if (puntos_ventas.length > 0) {
        //         const punto_venta = puntos_ventas[0];
        //         this.props.fetchBodega(punto_venta.bodega, (bodega => {
        //             this.props.fetchMovimientosInventariosSaldosxBodega(bodega.id, null);
        //             this.setState({punto_venta, bodega})
        //         }));
        //     }
        // });
    }

    componentWillUnmount() {
        this.props.clearPuntosVentas();
    }

    render() {
        const {inventario_list, auth: {punto_venta}} = this.props;
        return (
            <div className="p-3">
                <div className="row">
                    <div className="col-6">
                        {/*<ListaProductos productos={inventario_list}/>*/}
                    </div>
                    <div className="col-6">
                        {/*<Cuenta/>*/}
                    </div>
                </div>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
        puntos_ventas: _.pickBy(state.puntos_ventas, e => e.tipo === 1),
        inventario_list: state.movimientos_inventarios_detalles,
    }
}

export default connect(mapPropsToState, actions)(App)