import React, {Fragment, memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../../permisos/validar_permisos";
import {permisosAdapter} from "../../../../00_utilities/common";
import AddPuntoVenta from './ColaboradorDetailAddPuntoVenta';
import {
    COLABORADORES as permisos_view
} from "../../../../permisos";
import Typography from '@material-ui/core/Typography/index';
import MyDialogButtonDelete from "../../../../00_utilities/components/ui/dialog/DeleteDialog";

const TablaPDV = (props) => {
    const {pdv_colaborador, quitarPuntoVenta} = props;
    return (
        <Fragment>
            {
                pdv_colaborador && pdv_colaborador.length > 0 &&
                <table className='table table-striped table-responsive'>
                    <tbody>
                    {
                        pdv_colaborador.map(pdv => {
                            return <tr key={pdv.id}>
                                <td>{pdv.nombre}</td>
                                <td>
                                    <MyDialogButtonDelete
                                        onDelete={() => {
                                            quitarPuntoVenta(pdv)
                                        }}
                                        element_name={pdv.nombre}
                                        element_type='Punto de Venta'
                                    />
                                </td>
                            </tr>
                        })
                    }
                    </tbody>
                </table>
            }
        </Fragment>
    )
};

const Detail = memo(props => {
    const {id} = props.match.params;
    const mis_permisos = useSelector(state => state.mis_permisos);
    const puntos_ventas = useSelector(state => state.puntos_ventas);
    const object = useSelector(state => state.colaboradores[id]);
    const permisos_object = permisosAdapter(mis_permisos, permisos_view);
    const [puntos_ventas_colaborador, setPuntosVentasColaborador] = useState(null);
    const dispatch = useDispatch();
    const cargarDatos = () => {
        return dispatch(actions.fetchColaborador(id, {callback: cargarPuntosVentasColaborador}));
    };

    const addPuntoVenta = (punto_venta) => {
        dispatch(actions.adicionarPuntoVenta(id, punto_venta.id, {callback: cargarPuntosVentasColaborador}));
    };

    const quitarPuntoVenta = (punto_venta) => {
        dispatch(actions.quitarPuntoVenta(id, punto_venta.id, {callback: cargarPuntosVentasColaborador}));
    };

    const cargarPuntosVentasColaborador = () => {
        const fetchPuntosVentas = () => dispatch(actions.fetchPuntosVentas());
        dispatch(actions.fetchPuntosVentas_por_colaborador(
            id, {
                callback: puntos_ventas_colaborador => {
                    setPuntosVentasColaborador(puntos_ventas_colaborador);
                    fetchPuntosVentas()
                }
            })
        )
    };

    useEffect(() => {
        dispatch(actions.fetchMisPermisosxListado([permisos_view], {callback: cargarDatos}));
        return () => {
            dispatch(actions.clearColaboradores());
            dispatch(actions.clearPermisos());
            dispatch(actions.clearPuntosVentas());
        };
    }, []);

    const puntos_venta_para_adicionar = puntos_ventas_colaborador ? _.pickBy(puntos_ventas, pv => !_.map(puntos_ventas_colaborador, pv => pv.id).includes(pv.id)) : null;
    if (!object) {
        return <Typography variant="overline" gutterBottom color="primary">
            Cargando...
        </Typography>
    }
    return (
        <ValidarPermisos can_see={permisos_object.detail} nombre='detalles de Colaborador'>
            <Typography variant="h5" gutterBottom color="primary">
                Detalle Colaborador {object.full_name_proxy}
            </Typography>
            <div className="row">
                <div className="col-12">
                    Puntos de Venta
                </div>
                <div className="col-12">
                    <AddPuntoVenta
                        addPuntoVenta={addPuntoVenta}
                        puntos_ventas={puntos_venta_para_adicionar}
                    />
                </div>
                <div className="col-12">
                    <TablaPDV pdv_colaborador={puntos_ventas_colaborador} quitarPuntoVenta={quitarPuntoVenta}/>
                </div>
            </div>
            <CargarDatos cargarDatos={cargarDatos}/>
        </ValidarPermisos>
    )
});

export default Detail;