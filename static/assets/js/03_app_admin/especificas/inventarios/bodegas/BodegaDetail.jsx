import React, {Fragment, useEffect, useState, memo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../00_utilities/common";
import Typography from '@material-ui/core/Typography/index';
import {
    BODEGAS as permisos_view,
} from "../../../../00_utilities/permisos/types";
import TablaInventarioActual from './BodegaInventarioMovimientoActualTabla';
import TablaInventarioProducto from './BodegaInventarioMovimientoProductoTabla';
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Button from '@material-ui/core/Button/index';
import FormControlLabel from '@material-ui/core/FormControlLabel/index';

const Detail = memo((props) => {
    const {id} = props.match.params;
    const [slideIndex, setSlideIndex] = useState(0);
    const [fecha_inicio_mov_inventario, setFechaInicial] = useState(null);
    const [fecha_final_mov_inventario, setFechaFinal] = useState(null);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const movimientos_inventarios_detalles = useSelector(state => state.movimientos_inventarios_detalles);
    const dispatch = useDispatch();
    const permisos_bodegas = permisosAdapter(mis_permisos, permisos_view);

    useEffect(() => {
            dispatch(actions.fetchMisPermisosxListado([
                permisos_view
            ], {callback: () => cargarDatos(0)}));
            return () => {
                dispatch(actions.clearBodegas());
            };
        }, []
    );

    const cargarDatos = (index = null) => {
        dispatch(actions.fetchBodega(id, {callback: () => cargarElementos(index)}))
    };
    const verMovimientoProducto = (item_id) => {
        setSlideIndex(1);
        dispatch(actions.clearMovimientosInventarios());
        dispatch(actions.fetchMovimientosInventariosDetallesxBodegaxProducto(id, item_id));
    };
    const consultaMovimientoInventarioPorFechas = () => {
        dispatch(actions.fetchMovimientosInventariosDetallesxBodegaxFecha(id, fecha_inicio_mov_inventario, fecha_final_mov_inventario));
    };
    const cargarElementos = (value = null) => {
        let index = value !== null ? value : slideIndex;
        if (index === 0) {
            dispatch(actions.fetchMovimientosInventariosDetallesSaldosxBodega(id));
        } else if (index === 1) {
            dispatch(actions.clearMovimientosInventariosDetalles());
            setFechaInicial(null);
            setFechaFinal(null);
        }
    };
    const handleChange = (event, value) => {
        if (value !== slideIndex) {
            cargarElementos(value);
        }
        setSlideIndex(value);
    };
    const object = useSelector(state => state.bodegas[id]);
    if (!object) {
        return <Typography variant="overline" gutterBottom color="primary">
            Cargando...
        </Typography>
    }

    return (
        <ValidarPermisos can_see={permisos_bodegas.detail} nombre='detalles de bodega'>
            <Typography variant="h5" gutterBottom color="primary">
                Detalle {object.nombre}
            </Typography>
            <Tabs indicatorColor="primary"
                  textColor="primary"
                  onChange={handleChange}
                  value={slideIndex}
            >
                <Tab label="Inventario Actual" value={0}/>
                <Tab label="Movimiento Inventario" value={1}/>
            </Tabs>

            {
                slideIndex === 0 &&
                <TablaInventarioActual
                    bodega={object}
                    list={movimientos_inventarios_detalles}
                    verMovimientoProducto={verMovimientoProducto}
                />
            }
            {
                slideIndex === 1 &&
                <Fragment>
                    <div className="row mt-2">
                        <div className="col-12 col-md-5">
                            <FormControlLabel
                                control={
                                    <DateTimePicker
                                        onChange={(e, s) => setFechaInicial(s)}
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
                                        onChange={(e, s) => setFechaFinal(s)}
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
                                    onClick={consultaMovimientoInventarioPorFechas}>
                                    Consultar
                                </Button>
                            }
                        </div>
                    </div>
                    <TablaInventarioProducto
                        list={movimientos_inventarios_detalles}
                    />
                </Fragment>
            }
            <CargarDatos cargarDatos={() => cargarDatos(slideIndex)}/>
        </ValidarPermisos>
    )
});

export default Detail;