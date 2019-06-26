import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import {withStyles} from '@material-ui/core/styles';
import CargarDatos from "../../../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
import DeleteDialog from "../../../../../00_utilities/components/ui/dialog/DeleteDialog";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Typography from '@material-ui/core/Typography';
import Lightbox from 'react-images';
import Button from '@material-ui/core/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    MOVIMIENTOS_INVENTARIOS as permisos_view
} from "../../../../../00_utilities/permisos/types";

import ListCrud from '../../movimientos_inventarios_detalles/components/movimientos_inventarios_detalles_list';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.state = {currentImage: 0, lightboxIsOpen: false};
        this.closeLightbox = this.closeLightbox.bind(this);
        this.openLightbox = this.openLightbox.bind(this);
        this.gotoNext = this.gotoNext.bind(this);
        this.gotoPrevious = this.gotoPrevious.bind(this);
    }

    gotoNext() {
        this.setState({
            currentImage: this.state.currentImage + 1,

        });
    }

    gotoPrevious() {
        this.setState({
            currentImage: this.state.currentImage - 1,

        });
    }

    closeLightbox() {
        this.setState({
            currentImage: 0,
            lightboxIsOpen: false,
        });

    }

    openLightbox(event, obj) {
        this.setState({
            currentImage: obj.index,
            lightboxIsOpen: true,
        });

    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view], {callback: () => this.cargarDatos()});
    }

    componentWillUnmount() {
        this.props.clearPermisos();
        this.props.clearMovimientosInventarios();
        this.props.clearMovimientosInventariosDetalles();
        this.props.clearProductos();
    }

    cargarDocumento(file) {
        const {id} = this.props.match.params;
        let formData = new FormData();
        formData.append('archivo', file);
        this.props.uploadFotoDocumentoMovimientoInventario(id, formData, {callback: () => this.cargarDatos()})
    }

    deleteDocumento(documento_id) {
        const {id} = this.props.match.params;
        this.props.deleteFotoDocumentoMovimientoInventario(id, documento_id, {callback: () => this.cargarDatos()})
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const callback = (movimiento) => {
            if (!movimiento.cargado) {
                if (movimiento.motivo === 'saldo_inicial') {
                    this.props.fetchProductosParaSaldoInicial();
                } else {
                    this.props.fetchProductos();
                }
            }

        };
        const cargarMovimientoInventario = () => this.props.fetchMovimientoInventario(id, {callback});
        this.props.fetchMovimientosInventariosDetallesxMovimiento(id, {callback: cargarMovimientoInventario});
    }

    render() {
        const {id} = this.props.match.params;
        const {object, mis_permisos, classes} = this.props;
        let {movimientos_inventarios_detalles_list} = this.props;
        movimientos_inventarios_detalles_list = _.pickBy(movimientos_inventarios_detalles_list, m => m.movimiento === parseInt(id));
        const permisos = permisosAdapter(mis_permisos, permisos_view);

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
            <ValidarPermisos can_see={permisos.view} nombre='detalles de movimiento inventario'>
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
                    {...this.props}
                    movimiento={object}
                    movimiento_inventario_object={object}
                    object_list={_.map(movimientos_inventarios_detalles_list, e => e)}
                    permisos_object={{
                        ...permisos,
                        add: (permisos.add && !object.cargado),
                        delete: (permisos.delete && !object.cargado),
                        change: (permisos.change && !object.cargado),
                    }}
                />

                <CargarDatos cargarDatos={this.cargarDatos}/>
                {
                    !object.cargado &&
                    _.size(movimientos_inventarios_detalles_list) > 0 &&
                    <span className='btn btn-primary' onClick={() => {
                        const {cargarInventarioMovimientoInventario} = this.props;
                        const cargarDetalles = () => this.props.fetchMovimientosInventariosDetallesxMovimiento(id);
                        cargarInventarioMovimientoInventario(id, {callback: cargarDetalles});
                    }}>
                    Cargar Inventario
                </span>
                }

                <Lightbox
                    preloadNextImage={false}
                    images={imagenes_documento}
                    onClose={this.closeLightbox}
                    onClickPrev={this.gotoPrevious}
                    onClickNext={this.gotoNext}
                    currentImage={this.state.currentImage}
                    isOpen={this.state.lightboxIsOpen}
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
                    onChange={(e) => this.cargarDocumento(e.target.files[0])}
                    accept=".jpg, .jpeg, .png"
                />

                <GridList className={classes.gridList} cols={6}>
                    {imagenes_documento.map(d => (
                        <GridListTile key={d.thumbnail}>
                            <img src={d.thumbnail} alt={d.thumbnail}
                                 onClick={() => this.setState({
                                     lightboxIsOpen: true,
                                     currentImage: imagenes_documento.findIndex(x => x.src === d.src)
                                 })}/>
                            <GridListTileBar
                                classes={{
                                    root: classes.titleBar,
                                    title: classes.title,
                                }}
                                actionIcon={
                                    <DeleteDialog
                                        element_type='Imagen de Documento'
                                        element_name=''
                                        onDelete={() => this.deleteDocumento(d.id)}
                                    />
                                }
                            />
                        </GridListTile>
                    ))}
                </GridList>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        movimientos_inventarios_detalles_list: state.movimientos_inventarios_detalles,
        object: state.movimientos_inventarios[id],
        mis_permisos: state.mis_permisos,
        productos_list: state.productos,
    }
}

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

export default withStyles(styles)(connect(mapPropsToState, actions)(Detail));