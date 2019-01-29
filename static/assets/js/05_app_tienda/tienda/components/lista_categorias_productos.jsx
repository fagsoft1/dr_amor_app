import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ListaMenuProductos from './lista_productos';

const ListaCategoriasItem = (props) => {
    const {item, mostrarProductos} = props;
    return (
        <div className="col-6 col-md-4 col-lg-3 col-xl-2 p-1">
            <div
                className='puntero p-4 text-center'
                style={{border: 'solid 1px black', borderRadius: '5px'}}
                onClick={() => mostrarProductos(true, item.nombre)}
            >
                {item.nombre}
            </div>
        </div>
    )
};

export default class ListaMenuCategorias extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            mostrar_productos: false,
            categoria_seleccionada: null
        };
        this.mostarProductos = this.mostarProductos.bind(this);
    }

    mostarProductos(mostrar, categoria_seleccionada = null) {
        this.setState({mostrar_productos: mostrar, categoria_seleccionada})
    }

    handleToggle = () => this.setState({open: !this.state.open});

    render() {
        const {productos} = this.props;
        const {mostrar_productos, categoria_seleccionada} = this.state;
        const productos_list = _.groupBy(productos, 'producto_categoria_nombre');
        let categorias = [];
        _.mapKeys(productos_list, (value, key) => {
            categorias = {...categorias, [key]: {nombre: key, productos: value}};
        });

        return (
            <div>
                <IconButton
                    label="Toggle Drawer"
                    onClick={this.handleToggle}
                />
                <Drawer open={this.state.open} width='100%'>
                    <div className="p-4">
                        <IconButton
                            label="Toggle Drawer"
                            onClick={this.handleToggle}
                        />
                        <div className="row p-2">
                            {!mostrar_productos ?
                                _.map(categorias, e =>
                                    <ListaCategoriasItem
                                        key={e.nombre}
                                        item={e}
                                        mostrarProductos={this.mostarProductos}
                                    />
                                ) :
                                <ListaMenuProductos
                                    productos={categorias[categoria_seleccionada].productos}
                                    mostrarProductos={this.mostarProductos}
                                />
                            }
                        </div>
                    </div>
                </Drawer>
            </div>
        );
    }
}