import React, {memo, useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import * as actions from "../../../../../01_actions";
import {TIPOS_COMPROBANTES_CONTABLES, TIPOS_COMPROBANTES_CONTABLES_EMPRESAS} from "../../../../../permisos";
import Typography from '@material-ui/core/Typography/index';
import useTengoPermisos from "../../../../../00_utilities/hooks/useTengoPermisos";
import ValidarPermisos from "../../../../../permisos/validar_permisos";
import crudHOC from "../../../../../00_utilities/components/HOCCrud";
import CreateForm from "./forms/TipoComprobanteContableEmpresaCRUDForm";
import Tabla from "./TipoComprobanteContableEmpresaCRUDTable";

const CRUD = crudHOC(CreateForm, Tabla);


const TipoComprobanteContableDetail = memo(props => {
    const {id} = props.match.params;
    const permisos_object = useTengoPermisos(TIPOS_COMPROBANTES_CONTABLES);
    const dispatch = useDispatch();

    const tipo_comprobante_contable = useSelector(state => state.contabilidad_tipos_comprobantes[id]);

    const cargarDatos = () => {
        dispatch(actions.fetchTipoComprobanteContable(id));
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearTiposComprobantesContables);
        }
    }, []);

    const permisos = useTengoPermisos(TIPOS_COMPROBANTES_CONTABLES_EMPRESAS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchTipoComprobanteContableEmpresa(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteTipoComprobanteContableEmpresa(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createTipoComprobanteContableEmpresa({
            ...item,
            tipo_comprobante: id
        }, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateTipoComprobanteContableEmpresa(id, item, options)),
    };

    if (!tipo_comprobante_contable) {
        return <Typography variant="overline" gutterBottom color="primary">
            Cargando...
        </Typography>
    }

    const {codigo_comprobante, descripcion, titulo_comprobante, tipos_comprobantes_empresas} = tipo_comprobante_contable;
    const list = _.mapKeys(tipos_comprobantes_empresas, 'id');
    return (
        <ValidarPermisos can_see={permisos_object.detail} nombre='Tipo Documento Contable'>
            <Typography variant="h5" gutterBottom color="primary">
                Detalle Comprobante {codigo_comprobante} - {descripcion}
            </Typography>
            <div className="row">
                <div className="col-12">
                    <Typography variant="body1" gutterBottom color="primary">
                        Titulo: {titulo_comprobante}
                    </Typography>
                </div>
                <div className="col-12">
                    <CRUD
                        posSummitMethod={() => cargarDatos()}
                        posDeleteMethod={() => cargarDatos()}
                        method_pool={method_pool}
                        list={list}
                        permisos_object={permisos}
                        plural_name=''
                        singular_name='Tipo Comprobante Contable Empresa'
                        cargarDatos={cargarDatos}
                    />
                </div>
            </div>
        </ValidarPermisos>
    )
});

export default TipoComprobanteContableDetail;