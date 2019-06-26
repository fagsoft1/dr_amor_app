import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/CargarDatos";
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
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
            fecha_inicio_mov_inventario: null,
            fecha_final_mov_inventario: null
        };
        this.cargarDatos = this.cargarDatos.bind(this);
        this.verMovimientoProducto = this.verMovimientoProducto.bind(this);
    }

    verMovimientoProducto(item_id) {
        const {id} = this.props.match.params;
        this.setState({slideIndex: 1});
        this.props.clearMovimientosInventarios();
        this.props.fetchMovimientosInventariosDetallesxBodegaxProducto(id, item_id);
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
            this.props.fetchMovimientosInventariosDetallesSaldosxBodega(id);
        } else if (index === 1) {
            this.props.clearMovimientosInventariosDetalles();
            this.setState({
                fecha_inicio_mov_inventario: null,
                fecha_final_mov_inventario: null
            })
        }
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view], {callback: () => this.cargarDatos(0)});
    }

    componentWillUnmount() {
        this.props.clearPermisos();
        this.props.clearBodegas();
    }

    cargarDatos(tab_index = null) {
        const {id} = this.props.match.params;
        this.props.fetchBodega(id, {callback: () => this.cargarElementos(tab_index)});
    }

    consultaMovimientoInventarioPorFechas() {
        const {id} = this.props.match.params;
        const {fecha_inicio_mov_inventario, fecha_final_mov_inventario} = this.state;
        this.props.fetchMovimientosInventariosDetallesxBodegaxFecha(id, fecha_inicio_mov_inventario, fecha_final_mov_inventario);
    }

    render() {
        const {object, movimientos_inventarios_detalles_list, mis_permisos} = this.props;
        const {fecha_inicio_mov_inventario, fecha_final_mov_inventario} = this.state;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        if (!object) {
            return <Typography variant="overline" gutterBottom color="primary">
                Cargando...
            </Typography>
        }
        return (
            <ValidarPermisos can_see={permisos.view} nombre='detalles de bodega'>
                <Typography variant="h5" gutterBottom color="primary">
                    Detalle {object.nombre}
                </Typography>
                <Tabs indicatorColor="primary"
                      textColor="primary"
                      onChange={this.handleChange}
                      value={this.state.slideIndex}
                >
                    <Tab label="Inventario Actual" value={0}/>
                    <Tab label="Movimiento Inventario" value={1}/>
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
                    <Fragment>
                        <div className="row mt-2">
                            <div className="col-12 col-md-5">
                                <FormControlLabel
                                    control={
                                        <DateTimePicker
                                            onChange={(e, s) => this.setState({fecha_inicio_mov_inventario: s})}
                                            time={false}
                                        />
                                    }
                                    label="Fecha Inicial"
                                    labelPlacement="start"
                                />
                            </div>
                            <div className="col-12 col-md-5">
                                <FormControlLabel
                                    control={
                                        <DateTimePicker
                                            onChange={(e, s) => this.setState({fecha_final_mov_inventario: s})}
                                            time={false}
                                        />
                                    }
                                    label="Fecha Final"
                                    labelPlacement="start"
                                />
                            </div>
                            <div className="col-12 col-md-2">
                                {
                                    fecha_inicio_mov_inventario &&
                                    fecha_final_mov_inventario &&
                                    <Button
                                        variant="contained"
                                        color='primary'
                                        onClick={() => this.consultaMovimientoInventarioPorFechas()}>
                                        Consultar
                                    </Button>
                                }
                            </div>
                        </div>
                        <TablaInventarioProducto
                            data={_.map(_.orderBy(movimientos_inventarios_detalles_list, ['modified'], ['desc']), e => e)}
                        />
                    </Fragment>
                }
                <CargarDatos cargarDatos={() => this.cargarDatos(this.state.slideIndex)}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        movimientos_inventarios_detalles_list: state.movimientos_inventarios_detalles,
        mis_permisos: state.mis_permisos,
        object: state.bodegas[id]
    }
}

export default connect(mapPropsToState, actions)(Detail)