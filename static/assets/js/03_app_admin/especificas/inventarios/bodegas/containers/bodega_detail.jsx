import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {SinObjeto} from "../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
import Typography from '@material-ui/core/Typography';
import {
    BODEGAS as permisos_view
} from "../../../../../00_utilities/permisos/types";

import TablaInventarioActual from '../components/bodegas_inventario_movimiento_actual_tabla';
import TablaInventarioProducto from '../components/bodegas_inventario_movimiento_producto_tabla';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    slide: {
        padding: 10,
    },
};

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.cargarDatos = this.cargarDatos.bind(this);
        this.verMovimientoProducto = this.verMovimientoProducto.bind(this);
    }

    verMovimientoProducto(item_id) {


        const {id} = this.props.match.params;
        this.setState({slideIndex: 1});
        this.props.clearMovimientosInventarios();
        this.props.fetchMovimientosInventariosxBodegaxProducto(id, item_id);
    }

    handleChange = (event, value) => {
        if (value !== this.state.slideIndex) {
            this.cargarElementos(value);
        }
        this.setState({
            slideIndex: value,
        });
    };

    cargarElementos(value = null) {
        let index = value !== null ? value : this.state.slideIndex;
        if (index === 0) {
            const {id} = this.props.match.params;
            this.props.fetchMovimientosInventariosSaldosxBodega(id);
        } else if (index === 1) {

        }
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearPermisos();
        this.props.clearBodegas();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        this.props.fetchBodega(id, {callback: this.cargarElementos});
    }

    render() {
        const {object, movimientos_inventarios_detalles_list} = this.props;
        const permisos = permisosAdapter(permisos_view);


        if (!object) {
            return <SinObjeto/>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de bodega'>
                <Typography variant="h5" gutterBottom color="primary">
                    Detalle {object.nombre}
                </Typography>
                <Tabs indicatorColor="primary"
                      textColor="primary"
                      onChange={this.handleChange}
                      value={this.state.slideIndex}
                >
                    <Tab label="Inventario Actual" value={0}/>
                    <Tab label="Moviemiento Inventario" value={1}/>
                </Tabs>

                {
                    this.state.slideIndex === 0 &&
                    <TablaInventarioActual
                        data={
                            _.map(
                                _.pickBy(movimientos_inventarios_detalles_list, e => {
                                    return (e.es_ultimo_saldo && e.bodega === object.id)
                                }),
                                e => e
                            )
                        }
                        verMovimientoProducto={this.verMovimientoProducto}
                    />
                }
                {
                    this.state.slideIndex === 1 &&
                    <TablaInventarioProducto
                        data={_.map(_.orderBy(movimientos_inventarios_detalles_list, ['modified'], ['desc']), e => e)}
                    />
                }
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        movimientos_inventarios_detalles_list: state.movimientos_inventarios_detalles,
        auth: state.auth,
        object: state.bodegas[id]
    }
}

export default connect(mapPropsToState, actions)(Detail)