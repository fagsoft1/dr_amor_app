import React, {memo, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import useInterval from '../../00_utilities/hooks/useInterval';
import ValidarPermisos from "../../permisos/validar_permisos";
import CreateForm from './forms/AccesoForm';
import CategoriaModelo from './CategoriaModeloGrupo';
import Typography from '@material-ui/core/Typography/index';
import Button from '@material-ui/core/Button/index';
import CargarDatos from "../../00_utilities/components/system/CargarDatos";
import * as actions from "../../01_actions/01_index";
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import {TIPOS_REGISTRO_INGRESO} from "../../permisos";

const List = memo(props => {
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(TIPOS_REGISTRO_INGRESO);
    let terceros = useSelector(state => state.terceros);

    const modelos_presentes = _.pickBy(terceros, tercero => {
        return (tercero.es_acompanante & tercero.presente)
    });

    const colaboradores_presentes = _.pickBy(terceros, tercero => {
        return (tercero.es_colaborador & tercero.presente)
    });

    const categorias = _.groupBy(modelos_presentes, 'categoria_modelo_nombre');
    let modelosxcategoria = [];
    _.mapKeys(categorias, (categoria, nombre) => {
        modelosxcategoria = [...modelosxcategoria, {"categoria": nombre, "modelos": categoria}];
    });


    terceros = _.map(terceros, c => {
        return ({
            id: c.id,
            nombre: c.full_name_proxy
        })
    });
    const cargarDatos = () => {
        if (!modal_open) {
            dispatch(actions.fetchTercerosPresentes({
                show_cargando: false,
                limpiar_coleccion: false
            }));
        }
    };

    useInterval(() => {
        cargarDatos();
    }, 5000);

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearColaboradores());
            dispatch(actions.clearAcompanantes());
        };
    }, []);

    const renderCategoria = (categoria) => {
        return (
            <CategoriaModelo
                key={categoria.categoria}
                categoria={categoria}
                onClickModelo={onSelectTercero}
            />
        )
    };

    const onSelectTercero = (tercero) => {
        setSelectItem({id_tercero: tercero.id});
        setTipoRegistro('Registro Salida');
        setModalOpen(true);
    };

    const onSubmit = (item) => {
        let metodo = null;
        if (tipo_registro === 'Registro Entrada') {
            metodo = actions.registrarIngresoTercero;
        } else if (tipo_registro === 'Registro Salida') {
            metodo = actions.registrarSalidaTercero;
        }
        const callback = () => {
            dispatch(
                actions.fetchTercerosPresentes({
                    callback: () => {
                        setModalOpen(false);
                        setTipoRegistro(null);
                        setSelectItem(null);
                    }
                })
            );
        };
        if (metodo) {
            dispatch(metodo(item.id_tercero, item.pin, {callback}));
        }
    };
    const [item_seleccionado, setSelectItem] = useState(null);
    const [modal_open, setModalOpen] = useState(false);
    const [tipo_registro, setTipoRegistro] = useState(null);
    return (
        <ValidarPermisos can_see={permisos.add} nombre='Acceso'>
            <div className='cr-reg-acc'>
                <Button
                    color='primary'
                    className='ml-3'
                    onClick={() => {
                        setModalOpen(true);
                        setTipoRegistro('Registro Entrada');
                        dispatch(actions.fetchTercerosAusentes());
                    }}
                >
                    Registrar Entrada
                </Button>
                <Button
                    color='primary'
                    className='ml-3'
                    onClick={() => {
                        setModalOpen(true);
                        setTipoRegistro('Registro Salida');
                        dispatch(actions.fetchTercerosPresentes());
                    }}
                >
                    Registrar Salida
                </Button>
                {
                    modal_open &&
                    <CreateForm
                        tipo_registro={tipo_registro}
                        list={terceros}
                        initialValues={item_seleccionado}
                        {...props}
                        modal_open={modal_open}
                        onCancel={() => {
                            setModalOpen(false);
                            setSelectItem(null);
                            setTipoRegistro(null);
                            dispatch(actions.fetchTercerosPresentes())
                        }}
                        onSubmit={onSubmit}
                    />
                }
                {modelosxcategoria.map(categoria => {
                    return renderCategoria(categoria)
                })}
                <div className="col-12">
                    <Typography variant="h4" gutterBottom color="primary">
                        Colaboradores
                    </Typography>
                    <div className="row">
                        {_.map(colaboradores_presentes, colaborador => {
                            return (
                                <div
                                    key={colaborador.id}
                                    className="col-12 col-md-4 col-xl-3 puntero"
                                    onClick={() => onSelectTercero(colaborador)}
                                >
                                    {colaborador.full_name_proxy}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </ValidarPermisos>
    )
});
export default List;