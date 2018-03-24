import React, {Component, Fragment} from 'react';
import {REGEX_SOLO_NUMEROS, numerosFormato} from "../../../../../00_utilities/common";

export default class TablaProcesoTrasladoItem extends Component {
    constructor(props) {
        super(props);
        this.state = ({cantidad: 0});
    }

    componentDidMount() {
        const {item} = this.props;
        this.setState({cantidad: item.cantidad})
    }

    render() {
        const {item, updateCantidadTraslado} = this.props;
        const trasladado = this.props.traslado.trasladado;
        return (
            <tr>
                <td>
                    {item.producto_nombre}
                </td>
                {
                    trasladado &&
                    <td>
                        {numerosFormato(item.cantidad_realmente_trasladada)}
                    </td>
                }
                {
                    !trasladado &&
                    <Fragment>
                        <td>
                            {item.cantidad_origen && numerosFormato(item.cantidad_origen)}
                        </td>
                        <td>
                            {item.cantidad_destino ? numerosFormato(item.cantidad_destino) : 0}
                        </td>
                    </Fragment>
                }
                <td>
                    {
                        !trasladado ?
                            <input type="text" value={this.state.cantidad}
                                   onBlur={() => {
                                       const cantidad = this.state.cantidad;
                                       updateCantidadTraslado({...item, cantidad});
                                   }}
                                   onChange={(e) => {
                                       const cantidad = e.target.value;
                                       if (REGEX_SOLO_NUMEROS.test(cantidad)) {
                                           this.setState({cantidad: e.target.value});
                                       }
                                   }}/> :
                            numerosFormato(item.cantidad)
                    }
                </td>
                {
                    !trasladado &&
                    <Fragment>
                        <td>
                            {item.cantidad_origen && Number(item.cantidad_origen) - Number(this.state.cantidad)}
                        </td>
                        <td>
                            {item.cantidad_destino ? Number(item.cantidad_destino) + Number(this.state.cantidad) : Number(this.state.cantidad)}
                        </td>
                        <td>
                            <i onClick={() => this.props.eliminarItem(item.id)} className='far fa-trash puntero'></i>
                        </td>
                    </Fragment>
                }
            </tr>
        )
    }
}