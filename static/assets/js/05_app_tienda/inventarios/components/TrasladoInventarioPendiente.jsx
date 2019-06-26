import React, {Fragment} from "react";
import {fechaHoraFormatoUno} from "../../../00_utilities/common";
import GeneralDialog from '../../../00_utilities/components/ui/dialog/general_dialog';
import IconButtonTableSee from '../../../00_utilities/components/ui/icon/TableIconButtonDetail';
import PropTypes from "prop-types";
import Typography from '@material-ui/core/Typography';

class TrasladosInventariosPendientesTienda extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open_inventario_traslado: false,
            traslado_seleccionado_id: null
        };
        this.onCerrarDetalleTraslado = this.onCerrarDetalleTraslado.bind(this);
        this.onTrasladar = this.onTrasladar.bind(this);
    }

    onSelectTrasladoInventarioPendiente(traslado_id) {
        const callback = () => this.setState({open_inventario_traslado: true, traslado_seleccionado_id: traslado_id});
        this.props.fetchTrasladosInventariosDetallesxTralado(traslado_id, {callback});
    }

    onCerrarDetalleTraslado() {
        this.props.clearTrasladosInventariosDetalles();
        this.setState({open_inventario_traslado: false, traslado_seleccionado_id: null})
    }

    onTrasladar() {
        const {traslado_seleccionado_id} = this.state;
        this.props.trasladarTrasladoInventario(traslado_seleccionado_id, {callback: this.onCerrarDetalleTraslado})
    }

    render() {
        let {traslados_inventarios_detalles, traslados_inventarios, punto_venta_actual, cargarDatos} = this.props;
        const {open_inventario_traslado, traslado_seleccionado_id} = this.state;
        traslados_inventarios = _.pickBy(
            traslados_inventarios,
            t => (
                t.bodega_destino = punto_venta_actual.bodega &&
                    !t.trasladado &&
                    t.estado === 2
            )
        );
        return (
            <Fragment>
                {
                    open_inventario_traslado && traslados_inventarios[traslado_seleccionado_id] &&
                    <GeneralDialog
                        onComponentWillUnmount={() => cargarDatos()}
                        is_open={open_inventario_traslado}
                        titulo={'Item Traslado'}
                        onCerrar={() => this.setState({open_inventario_traslado: false})}
                        onOptionalAction1={this.onTrasladar}
                        onOptionalTextButton1={'Trasladar'}
                    >
                        <Fragment>
                            <Typography variant="body1" gutterBottom color="primary">
                                Desde: {traslados_inventarios[traslado_seleccionado_id].bodega_origen_nombre}
                            </Typography>
                            <Typography variant="body1" gutterBottom color="primary">
                                Creado por: {traslados_inventarios[traslado_seleccionado_id].creado_por_username}
                            </Typography>

                            <table className='table table-striped table-responsive' style={{fontSize: '0.8rem'}}>
                                <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    _.map(traslados_inventarios_detalles, d =>
                                        <tr key={d.id}>
                                            <td>{d.id}</td>
                                            <td>{d.producto_nombre}</td>
                                            <td>{d.cantidad}</td>
                                        </tr>
                                    )
                                }
                                </tbody>

                            </table>
                        </Fragment>
                    </GeneralDialog>
                }

                <div className="col-12 col-md-6">
                    <Typography variant="h6" gutterBottom color="primary">
                        Traslados Pendientes
                    </Typography>
                    <table className='table table-striped table-responsive' style={{fontSize: '0.8rem'}}>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Bodega Origen</th>
                            <th>Fecha</th>
                            <th>Ver</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            _.map(traslados_inventarios, t =>
                                <tr key={t.id}>
                                    <td>{t.id}</td>
                                    <td>{t.bodega_origen_nombre}</td>
                                    <td>{fechaHoraFormatoUno(t.created)}</td>
                                    <td>
                                        <IconButtonTableSee
                                            onClick={() => this.onSelectTrasladoInventarioPendiente(t.id)}
                                        />
                                    </td>
                                </tr>
                            )
                        }

                        </tbody>
                    </table>
                </div>

            </Fragment>
        );
    }
}

TrasladosInventariosPendientesTienda.propTypes = {
    punto_venta_actual: PropTypes.object.isRequired,
    traslados_inventarios: PropTypes.any.isRequired,
    traslados_inventarios_detalles: PropTypes.any.isRequired,
};
export default TrasladosInventariosPendientesTienda;