import React, {Component, Fragment} from 'react';
import DropdownList from 'react-widgets/lib/DropdownList';
import Button from '@material-ui/core/Button';

class AddPuntoVenta extends Component {
    constructor(props) {
        super(props);
        this.state = {punto_venta: null}
    }

    render() {
        const {puntos_ventas, addPuntoVenta} = this.props;
        const {punto_venta} = this.state;
        const puntos_ventas_array = _.map(_.orderBy(puntos_ventas, ['nombre'], ['asc']), p => p);
        return (
            <Fragment>
                {
                    puntos_ventas_array.length > 0 &&
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <DropdownList
                                data={puntos_ventas_array}
                                placeholder='Punto Venta'
                                valueField='id'
                                textField='nombre'
                                onSelect={(punto_venta) => this.setState({punto_venta})}
                            />
                        </div>
                        <div className="col-12 col-md-2">
                            {
                                punto_venta &&
                                <Button
                                    color='primary'
                                    className='ml-3'
                                    onClick={() => {
                                        addPuntoVenta(punto_venta)
                                    }}
                                >
                                    Adicionar
                                </Button>
                            }
                        </div>
                    </div>
                }
            </Fragment>
        )
    }
}

export default AddPuntoVenta;