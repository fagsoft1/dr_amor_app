import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions";
import {withStyles} from '@material-ui/core/styles/index';
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../../permisos/validar_permisos";
import {permisosAdapter} from "../../../../00_utilities/common";
import DeleteDialog from "../../../../00_utilities/components/ui/dialog/DeleteDialog";
import GridList from '@material-ui/core/GridList/index';
import GridListTile from '@material-ui/core/GridListTile/index';
import GridListTileBar from '@material-ui/core/GridListTileBar/index';
import Typography from '@material-ui/core/Typography/index';
import Lightbox from 'react-images';
import Button from '@material-ui/core/Button/index';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome/index';
import {
    MOVIMIENTOS_INVENTARIOS as permisos_view,
    MOVIMIENTOS_INVENTARIOS_DETALLES as permisos_detalle_view
} from "../../../../permisos";

import ListCrud from '../movimientos_inventarios_detalles/MovimientoInventarioDetalleCRUD';


const Detail = (props) => {
    const {id} = props.match.params;
    const {classes} = props;
    const mis_permisos = useSelector(state => state.mis_permisos);
    const movimientos_inventarios_detalles = useSelector(state => state.movimientos_inventarios_detalles);
    const productos = useSelector(state => state.productos);
    const object = useSelector(state => state.movimientos_inventarios[id]);
    const dispatch = useDispatch();
    const permisos = permisosAdapter(mis_permisos, permisos_view);
    const permisos_detalle = permisosAdapter(mis_permisos, permisos_detalle_view);

    const [currentImage, setCurrentImage] = useState(0);
    const [lightboxIsOpen, setLightboxIsOpen] = useState(false);


    const cargarDatos = () => {
        const callback = (movimiento) => {
            if (!movimiento.cargado) {
                if (movimiento.motivo === 'saldo_inicial') {
                    dispatch(actions.fetchProductosParaSaldoInicial())
                } else {
                    dispatch(actions.fetchProductos())
                }
            }

        };
        const cargarMovimientoInventario = () => dispatch(actions.fetchMovimientoInventario(id, {callback}));
        return dispatch(actions.fetchMovimientosInventariosDetallesxMovimiento(id, {callback: cargarMovimientoInventario}));

    };

    useEffect(() => {
        dispatch(actions.fetchMisPermisosxListado([
            permisos_view,
            permisos_detalle_view
        ], {callback: cargarDatos}));
        return () => {
            dispatch(actions.clearMovimientosInventarios());
            dispatch(actions.clearMovimientosInventariosDetalles());
            dispatch(actions.clearProductos());
        };
    }, []);


    const gotoNext = () => {
        setCurrentImage(currentImage + 1);
    };

    const gotoPrevious = () => {
        setCurrentImage(currentImage - 1);
    };

    const closeLightbox = () => {
        setCurrentImage(0);
        setLightboxIsOpen(false);
    };

    const openLightbox = (event, obj) => {
        setCurrentImage(obj.index);
        setLightboxIsOpen(true);
    };

    const cargarDocumento = (file) => {
        let formData = new FormData();
        formData.append('archivo', file);
        dispatch(actions.uploadFotoDocumentoMovimientoInventario(id, formData, {callback: cargarDatos}))
    };

    const deleteDocumento = (documento_id) => {
        dispatch(actions.deleteFotoDocumentoMovimientoInventario(id, documento_id, {callback: cargarDatos}))
    };

    if (!object) {
        return <Typography variant="overline" gutterBottom color="primary">
            Cargando...
        </Typography>
    }

    const imagenes_documento = _.map(object.documentos, d => ({
        src: d.imagen_documento_url,
        id: d.id,
        thumbnail: d.imagen_documento_thumbnail_url
    }));

    return (
        <ValidarPermisos can_see={permisos.detail} nombre='detalles de movimiento inventario'>
            <Typography variant="h5" gutterBottom color="primary">
                Detalle
            </Typography>
            <div className="row">
                <div className="col-12"><strong>Bodega: </strong>{object.bodega_nombre}</div>
                {object.proveedor_nombre &&
                <div className="col-12"><strong>Proveedor: </strong>{object.proveedor_nombre}</div>}
                {object.observacion &&
                <div className="col-12"><strong>Observación: </strong>{object.observacion}</div>}
            </div>
            {
                object.detalle &&
                <Typography variant="body1" gutterBottom>
                    <strong>Detalle: </strong>{object.detalle}
                </Typography>
            }

            <ListCrud
                productos={productos}
                movimiento={object}
                object_list={movimientos_inventarios_detalles}
                permisos_detalle={{
                    ...permisos_detalle,
                    add: (permisos_detalle.add && !object.cargado),
                    delete: (permisos_detalle.delete && !object.cargado),
                    change: (permisos_detalle.change && !object.cargado),
                }}
            />

            <CargarDatos cargarDatos={cargarDatos}/>
            {
                !object.cargado &&
                _.size(movimientos_inventarios_detalles) > 0 &&
                <span className='btn btn-primary' onClick={() => {
                    const {cargarInventarioMovimientoInventario} = props;
                    const cargarDetalles = () => props.fetchMovimientosInventariosDetallesxMovimiento(id);
                    cargarInventarioMovimientoInventario(id, {callback: cargarDetalles});
                }}>
                    Cargar Inventario
                </span>
            }

            <Lightbox
                preloadNextImage={false}
                images={imagenes_documento}
                onClose={closeLightbox}
                onClickPrev={gotoPrevious}
                onClickNext={gotoNext}
                currentImage={currentImage}
                isOpen={lightboxIsOpen}
            />

            <label htmlFor="file-upload" className="subir">
                <Button component='span' color='primary' variant="contained" className={classes.button}>
                    <FontAwesomeIcon
                        className={classes.leftIcon}
                        icon={['far', 'upload']}
                    /> Subir imagen de documento
                </Button>
            </label>

            <input
                id="file-upload"
                type="file"
                style={{display: 'none'}}
                onChange={(e) => cargarDocumento(e.target.files[0])}
                accept=".jpg, .jpeg, .png"
            />

            <GridList className={classes.gridList} cols={6}>
                {imagenes_documento.map(d => (
                    <GridListTile key={d.thumbnail}>
                        <img src={d.thumbnail} alt={d.thumbnail}
                             onClick={() => {
                                 setLightboxIsOpen(true);
                                 setCurrentImage(imagenes_documento.findIndex(x => x.src === d.src));
                             }}/>
                        <GridListTileBar
                            classes={{
                                root: classes.titleBar,
                                title: classes.title,
                            }}
                            actionIcon={
                                <DeleteDialog
                                    element_type='Imagen de Documento'
                                    element_name=''
                                    onDelete={() => deleteDocumento(d.id)}
                                />
                            }
                        />
                    </GridListTile>
                ))}
            </GridList>
        </ValidarPermisos>
    )

};


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.main,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,1) 100%)',
    },
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});

export default withStyles(styles)(Detail);