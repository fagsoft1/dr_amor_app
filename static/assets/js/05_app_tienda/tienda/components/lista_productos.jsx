import React, {Fragment} from 'react';
import {numerosFormato} from '../../../00_utilities/common';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const ListaProductosItem = (props) => {
    const {item} = props;
    return (
        <div className="col-6 col-md-4 col-lg-3 col-xl-2 p-1">
            <div
                className='puntero pt-4 pb-4 text-center'
                style={{border: 'solid 1px black', borderRadius: '5px', fontSize: '12px', height: '100%'}}
            >
                {item.producto_nombre}<br/>
                <span style={{color: 'red'}}>{numerosFormato(item.saldo_cantidad)}</span>
            </div>
        </div>
    )
};

export default class ListaMenuProductos extends React.Component {
    render() {
        const {productos, mostrarProductos} = this.props;
        return (
            <Fragment>
                <div className='col-12'>
                    <FontAwesomeIcon
                        className='puntero'
                        onClick={() => mostrarProductos(false)}
                        icon={['far', 'arrow-circle-left']}
                        size='3x'
                    />
                </div>
                {
                    _.orderBy(productos, ['producto_nombre'], ['asc']).map(p =>
                        <ListaProductosItem
                            key={p.id}
                            item={p}/>)
                }
            </Fragment>
        );
    }
}